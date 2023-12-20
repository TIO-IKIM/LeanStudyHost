# -*- coding: utf-8 -*-
"""Best-effort DICOM deidentification.
Resources:

Mandatory DICOM tags
https://www.pclviewer.com/help/required_dicom_tags.htm

Deidentification requirements
https://www.dicomstandard.org/News-dir/ftsup/docs/sups/sup55.pdf
(Table X.1-1)

https://github.com/salimkanoun/Orthanc-Tools-JS/blob/master/Documentation/Orthanc-Tools-JS-Documentation.pdf
https://bitbucket.org/osimis/orthanc-setup-samples/src/master/docker/python/orthanc/
"""
from deid.config import DeidRecipe
from deid.dicom.parser import DicomParser
import pydicom
from pydicom.uid import generate_uid
from Crypto.Hash import SHA512
from datetime import datetime
from dateutil.relativedelta import relativedelta
from dotenv import dotenv_values
from pyorthanc import Orthanc
from .deidentification_profiles import (
    date_obfuscation,
    time_obfuscation,
    datetime_obfuscation,
)
import json


class OrthancClient:
    """This class allows to pseudonymize an instance of
    pydicom.Dataset with our custom recipe and functions.
    """

    def __init__(
        self,
        orthanc_url: str,
        username: str = None,
        password: str = None,
        recipe_path: str = None,
        meta: dict = None,
        secret_salt: str = None,
    ) -> None:
        """New instance of our orthanc connector class.

        :param secret_salt: a random string that makes the
         hashing harder to break.
        :param recipe_path: path to our deid recipe.
        """
        self.secret_salt = secret_salt
        self.recipe = (
            DeidRecipe(recipe_path)
            if recipe_path is not None
            else "StudyUpload/testing/data/deidentification.dicom"
        )

        self.orthanc_url = orthanc_url
        self._usr = username
        self._pwd = password
        if (self._usr is None) or (self._pwd is None):
            env_path = r"environments/orthanc/orthanc.env"
            try:
                config = dotenv_values(env_path)
                pair = json.loads(config["ORTHANC__REGISTERED_USERS"])
                self._usr = list(pair.keys())[0]
                self._pwd = list(pair.values())[0]
            except (FileNotFoundError, KeyError):
                raise ValueError(f"No credentials supplied for Orthanc client")

        self.orthanc = Orthanc(self.orthanc_url)
        self.orthanc.setup_credentials(self._usr, self._pwd)
        self.meta = None if meta is None else meta

    def pseudonymize(self, dataset: str):
        """Pseudonymize a single dicom dataset

        :param dataset: dataset that will be pseudonymized
        :returns: pseudonymized dataset
        """
        dcm = pydicom.dcmread(dataset)  # Consider stop_before_pixels
        dcm.PatientID = self.meta["id"]
        parser = DicomParser(dcm, self.recipe)
        # register functions that are specified in the recipe
        # idea: set the name to the ID given in the form by passing the request body
        #
        parser.define("replace_name", self.replace_name)
        parser.define("hash_func", self.deid_hash_func)
        parser.define("remove_month_and_day", self.remove_month_and_day)
        parser.define("new_UID", self.new_UID)
        parser.define("jitter_ts", self.jitter_ts)
        parser.define("handle_image_comments", self.handle_image_comments)
        # parse the dataset and apply the deidentification
        parser.parse()

        parser.dicom.save_as(dataset)
        return dataset

    def send(self, filepath: str) -> str:
        """Send a file to the connected instance"""
        with open(filepath, "rb") as f:
            self.orthanc.post_instances(f.read())
        return filepath

    def pseudonymize_and_send(self, dataset: str) -> str:
        """Returns file handle of deid'd file"""
        deidentified = self.pseudonymize(dataset)
        filepath = self.send(deidentified)
        return filepath

    # All registered functions that are used in the recipe must
    # receive the arguments: `item`, `value`, `field`, `dicom`

    def deid_hash_func(self, item, value, field, dicom) -> str:
        """Performs self.hash to field.element.value"""
        val = field.element.value
        return self.hash(str(val))

    @staticmethod
    def remove_month_and_day(item, value, field, dicom) -> str:
        """Removes the day from a DT field in the deid framework"""
        dt = datetime.strptime(field.element.value, "%Y%m%d")
        # if dt.month > 6:
        #     dt = dt + relativedelta(years=1)
        return dt.strftime("%Y0101")

    @staticmethod
    def new_UID(item, value, field, dicom) -> str:
        """Generate new UID based on the old one it stays consistent"""
        return generate_uid(entropy_srcs=[field.element.value])

    @staticmethod
    def replace_name(item, value, field, dicom) -> str:
        """Replace PatientName with PatientSex and coarse PatientAge"""
        sex = dicom.get("PatientSex")
        sex = {"F": "Female", "M": "Male", "O": "Other"}[sex]

        dob = datetime.strptime(dicom[0x0010, 0x0030].value, "%Y%m%d").replace(
            microsecond=0
        )
        now = datetime.today().replace(microsecond=0)
        age = abs(relativedelta(now, dob).years)

        return f"{sex} {age:03d}Y {dicom.get('Modality')}"

    # Helper methods for our registered ones
    @staticmethod
    def round_to_nearest(value, interval):
        """Rounds value to the closest multiple of interval"""
        return interval * round(value / interval)

    def hash(self, msg: str) -> str:
        """
        :param msg: message that we want to encrypt,
         normally the PatientID or the StudyID.
        :return: the encrypted message as hexdigest
         (in characters from '0' to '9' and 'a' to 'f')
        """
        assert isinstance(msg, str), f"value is not of type str, {type(msg)}"
        h = SHA512.new(truncate="256")
        if self.secret_salt is None:
            bytes_str = bytes(msg, "utf-8")
        else:
            bytes_str = bytes(f"{self.secret_salt}{msg}", "utf-8")
        h.update(bytes_str)
        return str(h.hexdigest())

    @staticmethod
    def jitter_ts(item, value, field, dicom):
        """Function to coordinate timestamps obfuscation etc."""
        ts = field.element.value
        match field.element.VR:
            case "DA":
                # Format YYYYMMDD according to standard on VRs
                if ts == "":
                    return ts
                date = datetime.strptime(ts, "%Y%m%d")
                return date_obfuscation(date).strftime("%Y%m%d")

            case "DT":
                # Format YYYYMMDDHHMMSS.FFFFFF&ZZXX according to standard on VRs, &ZZXX is optional
                assert "." in ts, f"Unknown format {ts}"
                if "&" in ts:
                    ts = ts.split("&")[0]
                dt = datetime.strptime(ts, "%Y%m%d%H%M%S.%f")
                return datetime_obfuscation(dt).strftime("%Y%m%d%H%M%S.%f")

            case "TM":
                # valid formats:
                # HH
                # HHMM
                # HHMMSS
                # HHMMSS.FFFFFF
                match len(ts):
                    case 2:
                        _format = "%H"
                    case 4:
                        _format = "%H%M"
                    case 6:
                        _format = "%H%M%S"
                    case 13:
                        _format = "%H%M%S.%f"
                    case _:
                        for f in ["%H", "%H%M", "%H%M%S", "%H%M%S.%f"]:
                            try:
                                _ = datetime.strptime(ts, f)
                                _format = f
                                break
                            except ValueError:
                                pass
                        else:
                            raise ValueError(
                                f"Format of {ts} is not compliant with DICOM standard and thus cannot be inferred"
                            )
                timestamp = datetime.strptime(ts, _format)
                return time_obfuscation(timestamp).strftime(_format)
            case _:
                pass

    def handle_image_comments(self, item, value, field, dicom):
        return f'{self.meta["comment"]}'
