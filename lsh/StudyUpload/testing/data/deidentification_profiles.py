# -*- coding: utf-8 -*-
import json
import datetime


def date_obfuscation(old_date: datetime.datetime) -> datetime.datetime:
    """Calculate new date, define your custom logic here"""
    new_date = old_date + datetime.timedelta(days=1)
    return new_date


def datetime_obfuscation(old_datetime: datetime.datetime) -> datetime.datetime:
    """Calculate new datetime, define your custom logic here"""
    new_datetime = old_datetime + datetime.timedelta(
        days=1, hours=1, minutes=1, seconds=1
    )
    return new_datetime


def time_obfuscation(old_time: datetime.datetime) -> datetime.datetime:
    """Calculate new time, define your custom logic here"""
    new_time = old_time + datetime.timedelta(hours=1, minutes=1, seconds=1)
    return new_time


def write_recipe():
    """
    DICOM Attribute Requirement Types
    Type 1:	Required to be in the SOP Instance and shall have a valid value.
    Type 2:	Required to be in the SOP Instance but may contain the value of "unknown", or a zero length value.
    Type 3:	Optional. May or may not be included and could be zero length.
    Type 1C:	Conditional. If a condition is met, then it is a Type 1 (required, cannot be zero). If condition is not met,
    then the tag is not sent.
    Type 2C:	Conditional. If condition is met, then it is a Type 2 (required, zero length OK). If condition is not met,
    then the tag is not sent.
    """

    dicom_type = 1

    action_lut = {
        "D": [
            "REPLACE",
            "REMOVED",
        ],  # with a non-zero length value that may be a dummy value consistent with the VR
        "Z": [
            "BLANK",
            "",
        ],  # with a zero length value, or a non-zero length value that may be a dummy value and
        # consistent with the VR
        "X": ["REMOVE", ""],
        "K": ["KEEP", ""],
        "C": ["REPLACE", "func:hashfunc"],
        # with values of similar meaning known not to contain identifying information and
        # consistent with the VR,
        "U": ["REPLACE", "func:new_UID"],  # UID replace
        "U*": ["REPLACE", "func:new_UID"],  # UID replace
    }

    header = """
    FORMAT dicom\n
    %header\n
    ADD PatientIdentityRemoved YES
    ADD DeidentificationMethod IKIM_DEID
    # Tags that require custom regex expressions
    # Curve Data"(50xx,xxxx)"
    REMOVE contains:^50.{6}$
    # Overlay comments and data (60xx[34]000)
    REMOVE contains:^60.{2}[34]000$
    # Private tags ggggeeee where gggg is odd
    REMOVE contains:^.{3}[13579].{4}$

    REPLACE contains:Date|Time func:jitter_ts
    """

    option_header = "FORMAT dicom\n%header\n"

    attributes_filepath = r"./attributes.json"
    confidentiality_profile_filepath = r"./confidentiality_profile_attributes.json"

    with open(attributes_filepath, "r") as af:
        attributes_lookup = json.load(af)

    with open(confidentiality_profile_filepath, "r") as cf:
        confidentiality_profile = json.load(cf)

    attributes_lookup = {d["tag"]: d for d in attributes_lookup}
    #
    # with open(r'./deidentification_base.dicom', 'w+') as recipe:
    #     recipe.write(header)
    for rule in confidentiality_profile:
        try:
            _ = attributes_lookup[rule["tag"]]["keyword"]
            if ("Date" in _) or ("Time" in _):
                continue
            action_codes = rule["basicProfile"].split("/")
            line = f"{action_lut[action_codes[dicom_type - 1]][0]} {_} {action_lut[action_codes[dicom_type - 1]][1]}\n"
            # recipe.write(line)
        except KeyError:
            # there are 4 undefined tag groups:
            # (0000, 1000) - Affected SOP Instance UID
            # (50XX, XXXX) - Retired curve data
            # (GGGG, EEEE) WHERE GGGG IS ODD -
            # (0000, 1001) - Requested SOP Instance UID
            pass

    additional_options = set(
        [
            f
            for d in confidentiality_profile
            for f in d.keys()
            if f not in ["name", "stdCompIOD", "tag", "id", "basicProfile"]
        ]
    )

    for option in additional_options:
        with open(f"./deid_options/{option}.dicom", "w+") as file:
            file.write(option_header)
            for rule in confidentiality_profile:
                try:
                    file.write(
                        f"{action_lut[rule[option]][0]} {attributes_lookup[rule['tag']]['keyword']}\n"
                    )
                except KeyError:
                    pass


if __name__ == "__main__":
    write_recipe()
