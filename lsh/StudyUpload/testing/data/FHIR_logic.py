# -*- coding: utf-8 -*-
import json
import requests
from requests.models import Response
from fhirclient import client
import fhirclient.models.patient as patient
import fhirclient.models.humanname as hn
from fhirclient.models.fhirdate import FHIRDate
from fhirclient.models.fhirreference import FHIRReference
from fhirclient.models.attachment import Attachment
import fhirclient.models.media as media


# https://hapifhir.io/hapi-fhir/docs/server_jpa/configuration.html#search-result-caching
# https://groups.google.com/g/hapi-fhir/c/Z_SnAtABz0U


class FHIRClient:
    # REFACTOR: use requests.Session() instead of normal requests
    def __init__(
        self, fhir_base_url: str, username: str = None, password: str = None
    ) -> None:
        self.fhir_base_url = fhir_base_url
        self.settings = {"app_id": "Study FHIR", "api_base": self.fhir_base_url}
        self.client = client.FHIRClient(settings=self.settings)
        # url standardization
        if not self.fhir_base_url.endswith("/"):
            self.fhir_base_url += "/"

        self._gender_lookup = {"M": "male", "F": "female", "O": "other", "U": "unknown"}

        self._patient_count = None
        self._patients = None

    @property
    def patient_count(self) -> int:
        resp = requests.get(
            url=f"{self.fhir_base_url}Patient?_summary=count",
            headers={"accept": "application/json", "Cache-Control": "no-cache"},
        )
        return int(resp.json()["total"])

    @property
    def patients(self) -> list:
        resp = requests.get(
            url=f"{self.fhir_base_url}Patient?",
            headers={"accept": "application/json", "Cache-Control": "no-cache"},
        )
        if self.patient_count > 0:
            patients = resp.json()["entry"]
            # remove unwanted tags
            sanitized = []
            for p in patients:
                if "text" in p["resource"]:
                    p["resource"].pop("text")
                if "meta" in p["resource"]:
                    p["resource"].pop("meta")
                if "search" in p:
                    p.pop("search")
                sanitized.append(p)
            return sanitized
        else:
            return []

    @patient_count.setter
    def patient_count(self, value) -> None:
        self._patient_count = value

    @patients.setter
    def patients(self, value) -> None:
        self._patients = value

    def _process_server_response(self, response: Response) -> int:
        # TODO: Better error messages, make this a decorator
        match response.status_code:
            case success if 200 <= response.status_code <= 299:
                return response.status_code
            case _:
                raise Exception(
                    f"Server {self.fhir_base_url} returned the following error:\n{response.json()}"
                )

    def get_patientID(self, patient_name: str) -> str:
        """Check if patient exists in FHIR DB by doing a name lookup and checking if a corresponding resource exists"""
        _p = patient.Patient.where(struct={"name": patient_name})
        found = _p.perform_resources(self.client.server)
        assert len(found) == 1
        return found[0].id

    def create_patient(
        self, patient_name: str, sex: str = None, birthdate: str = None
    ) -> None:
        """Creates a Patient resource given a name and date of birth (since that's all we get in the study)"""
        # https://smilecdr.com/docs/fhir_standard/fhir_crud_operations.html

        _p = patient.Patient()
        _p.gender = sex
        name = hn.HumanName()
        name.use = "official"
        name.text = patient_name
        _p.name = [name]
        dob = FHIRDate(jsonval=birthdate)
        _p.birthDate = dob
        _p.create(self.client.server)

    def create_imaging_study(self, resource: dict) -> int:
        """Create an arbitrary resource on the connected FHIR server"""
        # assert 'id' in resource
        resp = requests.put(
            url=f'{self.fhir_base_url}ImagingStudy/{resource["id"]}',
            headers={
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            data=json.dumps(resource),
        )
        return self._process_server_response(resp)

    def create_media(self, patient_name: str, file_url: str) -> None:
        _id = self.get_patientID(patient_name=patient_name)
        _m = media.Media()
        _m.id = file_url.replace("/", "-")
        reference = FHIRReference()
        reference.reference = f"Patient/{_id}"
        _m.subject = reference
        _m.status = "completed"
        attachment = Attachment()
        attachment.url = file_url
        _m.content = attachment

        # seems like fhirclient is unable to PUT data properly
        resp = requests.put(
            url=f"{self.fhir_base_url}{_m.resource_type}/{_m.id}",
            headers={
                "accept": "application/json",
                "Content-Type": "application/json",
            },
            data=json.dumps(_m.as_json()),
        )

    def delete_media(self, _id: str):
        delete = requests.delete(f"{self.fhir_base_url}Media/{_id}")
        self._process_server_response(delete)

    def imaging_study_lookup(self, value) -> dict:
        resp = requests.get(
            url=f"{self.fhir_base_url}ImagingStudy?identifier={value}",
            headers={"accept": "application/json"},
        )
        self._process_server_response(resp)
        if int(resp.json()["total"]) > 1:
            raise LookupError(f"Ambiguous entries for {value}")
        else:
            return resp.json()

    def delete_imaging_study(self, _id: str) -> None:
        delete = requests.delete(f"{self.fhir_base_url}ImagingStudy/{_id}")
        self._process_server_response(delete)

    def delete_patient(self, _id: str) -> None:
        delete = requests.delete(f"{self.fhir_base_url}Patient/{_id}")
        self._process_server_response(delete)
