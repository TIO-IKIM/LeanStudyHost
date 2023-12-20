# -*- coding: utf-8 -*-
from datetime import datetime
from dotenv import dotenv_values
from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpRequest, HttpResponse, QueryDict
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import requires_csrf_token, csrf_exempt
from fhirclient.models import imagingstudy, media
from functools import partial
from fhirclient.models.fhirreference import FHIRReference
from fhirclient.models.identifier import Identifier
from fhirclient.models.coding import Coding
from plotly.offline import plot
import multiprocessing as mp
from plotly.subplots import make_subplots
import plotly.graph_objs as go
import pandas as pd
import numpy as np
import logging
import requests
from pathlib import Path
import json
from ..testing.data.ORTHANC_send import OrthancClient
from ..testing.data.MINIO_send import MinioClient
from ..testing.data.FHIR_logic import FHIRClient
from ..testing.data.WSI2DCM import convert_and_send
from time import sleep
import threading
from typing import Any

DICOM_FILE_EXTENSIONS = (".dcm", ".DCM")

# load configs
fhir_config_path = r"environments/fhir/fhir.env"
minio_config_path = r"environments/minio/minio.env"
orthanc_config_path = r"environments/orthanc/orthanc.env"

fhir_config = dotenv_values(fhir_config_path)
minio_config = dotenv_values(minio_config_path)
orthanc_config = dotenv_values(orthanc_config_path)
FHIR_URL = fhir_config["FHIR_URL"]
MINIO_URL = minio_config["MINIO_URL"]
ORTHANC_URL = orthanc_config["ORTHANC_URL"]
FHIR_CREDENTIALS = (fhir_config["FHIR_ROOT_USER"], fhir_config["FHIR_ROOT_PASSWORD"])
MINIO_CREDENTIALS = (
    minio_config["MINIO_ROOT_USER"],
    minio_config["MINIO_ROOT_PASSWORD"],
)
pair = json.loads(orthanc_config["ORTHANC__REGISTERED_USERS"])
ORTHANC_CREDENTIALS = (list(pair.keys())[0], list(pair.values())[0])
ORTHANC_API = orthanc_config["ORTHANC_API"]
ORTHANC_WSI_CONVERSION_THREADS = int(orthanc_config["ORTHANC_WSI_CONVERSION_THREADS"])
NUM_PROCESSES = mp.cpu_count()

app_log = logging.getLogger("lsh")
# log_formatter = logging.Formatter("%(asctime)s - %(name)s - %(message)s")
# ch = logging.StreamHandler()
# ch.setLevel(logging.INFO)
# ch.setFormatter(log_formatter)
# app_log.addHandler(ch)


# Create your views here.
class LandingPage(TemplateView):
    """
    Alternative to the heimdall dashboard
    Class based view for the landing page reachable under its designated url.
    html-template: landing-page.html
    """

    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        """
        Retrieves the landing page and renders it using the specified HTML template.

        Args:
        - request (HttpRequest): The HTTP request object.
        Returns:
        - HttpResponse: The HTTP response object containing the rendered HTML template.
        """
        template_name = "spa/landing-page.html"
        return render(request, template_name)


# Maybe do an abstract base class that already has the connections to MinIO, FHIR & Orthanc
class ResourceConnector:
    """
    Abstract class purely for inheritance purposes. Connects to all resources that need interfacing.
    """

    def __init__(
        self,
        fhir_url: str = FHIR_URL,
        fhir_credentials: tuple[str, str] = FHIR_CREDENTIALS,
        minio_url: str = MINIO_URL,
        minio_credentials: tuple[str, str] = MINIO_CREDENTIALS,
        orthanc_url: str = ORTHANC_URL,
        orthanc_credentials: tuple[str, str] = ORTHANC_CREDENTIALS,
    ) -> None:
        """
        Initializes the ResourceConnector instance with the specified FHIR, Orthanc, and Minio URLs and credentials.

        Args:
        - fhir_url (str): The URL for the FHIR resource.
        - fhir_credentials (Tuple[str, str]): The credentials to access the FHIR resource.
        - minio_url (str): The URL for the Minio resource.
        - minio_credentials (Tuple[str, str]): The credentials to access the Minio resource.
        - orthanc_url (str): The URL for the Orthanc resource.
        - orthanc_credentials (Tuple[str, str]): The credentials to access the Orthanc resource.

        Returns:
        - None
        """
        self.fhir_client = FHIRClient(
            fhir_base_url=fhir_url,
            username=fhir_credentials[0],
            password=fhir_credentials[1],
        )
        self.orthanc_client = OrthancClient(
            orthanc_url=orthanc_url,
            username=orthanc_credentials[0],
            password=orthanc_credentials[1],
        )
        self.minio_client = MinioClient(
            endpoint=minio_url,
            access_key=minio_credentials[0],
            secret_key=minio_credentials[1],
        )


# Data upload
class SpaView(ResourceConnector, TemplateView):
    """
    Class based view for the upload mask and corresponding information
    """

    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        """
        Retrieves the upload page and renders it using the specified HTML template.

        Args:
        - request (HttpRequest): The HTTP request object.
        Returns:
        - HttpResponse: The HTTP response object containing the rendered HTML template.
        """
        template_name = "spa/index.html"
        fhir_patient_names = [
            p["resource"]["name"][0]["text"] for p in self.fhir_client.patients
        ]
        context = {"patient_names": json.dumps(fhir_patient_names)}
        return render(request, template_name, context)

    @method_decorator(requires_csrf_token)
    def post(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        """
        CSRF - protected POST to add the uploaded files to their respective storage

        Args:
        - request (HttpRequest): The HTTP request object.
        Returns:
        - HttpResponse: The HTTP response object containing the rendered HTML template.
        """
        # Data from the post request
        body = request.POST.copy()
        body["anonymize"] = eval(body["anonymize"].capitalize())
        files = request.FILES.getlist("files")
        files = [f.temporary_file_path() for f in files]

        # TODO: Add handling for files that have no file extension and still are dicom

        # is multiprocessing really necessary here? It will always be better if it is mp'd, but the bottleneck is likely
        # the internet bandwidth
        with mp.Pool(processes=NUM_PROCESSES) as p:
            p.map(partial(self._deid_and_send, body), files)

        app_log.info(
            f'{request.META["REMOTE_ADDR"]} - added files for {body["id"]}: {files}'
        )
        return HttpResponse(200)

    @staticmethod
    def _deid_and_send(metadata: QueryDict, data: str) -> None:
        """
        Wrapper function for parallel deidentification and sending
        Python's own multiprocessing can't handle classmethods, so we use a wrapper instead

        Args:
        - metadata (QueryDict): Metadata associated with the uploaded files.
        Returns:
        - None
        """
        # fhir_connector = FHIRClient(fhir_base_url=FHIR_URL)  # fhir:8080/fhir
        if str(data).endswith(DICOM_FILE_EXTENSIONS):
            orthanc_connector = OrthancClient(orthanc_url=ORTHANC_URL, meta=metadata)
            if metadata["anonymize"]:
                orthanc_connector.pseudonymize_and_send(data)
            else:
                orthanc_connector.send(data)
            # Create FHIR Patient & ImagingStudy
            # fhir_connector.create_imagingstudy(dicom_file=d)
        else:
            minio_connector = MinioClient("minio:9000")
            minio_connector.send_to_bucket(
                bucket_name="wsi-storage", directory=metadata["id"], file=data
            )
            # Create FHIR Patient & Media
            # no longer required, this is handled by the webhook now
            # fhir_connector.create_media(patient_name=metadata['id'], file_url=url)


class PatientManagement(ResourceConnector, TemplateView):
    """
    Class based view for the patient management page
    """

    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        """
        Retrieves the upload page and renders it using the specified HTML template.

        Args:
        - request (HttpRequest): The HTTP request object.
        Returns:
        - HttpResponse: The HTTP response object containing the rendered HTML template.
        """
        template_name = "spa/patient-management.html"
        context = {
            "fhir_patient_count": self.fhir_client.patient_count,
            "fhir_patients": json.dumps(self.fhir_client.patients),
        }
        return render(request, template_name, context)

    @method_decorator(requires_csrf_token)
    def post(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        """
        CSRF - protected POST to handle patient management logic.

        Args:
        - request (HttpRequest): The HTTP request object.
        Returns:
        - HttpResponse: The HTTP response object.
        """
        body = request.POST.copy()
        # overloading the post method like this irks me and I know the django REST API should likely be used instead of
        # relying on crude HTTP requests GET and POST, but I don't have the time or the resources to do this atm.
        # surprisingly, creating a delete method results in the request getting correctly routed to that method, but the
        # request.POST is empty and the information is only accessible in the request.body which is a nightmare to parse
        # This would pose an even bigger concern than this 'hack'
        # This (https://www.guguweb.com/2014/06/25/put-and-delete-http-requests-with-django-and-jquery/) has the same
        # issue

        match body["operation"].lower():
            case "create":
                name = body["name"]
                gender = body["gender"].lower()
                dob = datetime.strptime(body["dob"], "%d/%m/%Y").strftime("%Y-%m-%d")
                self.fhir_client.create_patient(
                    patient_name=name, sex=gender, birthdate=dob
                )
                app_log.info(
                    f'{request.META["REMOTE_ADDR"]} - created new patient {name} - {gender} - {dob}'
                )
                return HttpResponse(200)

            case "delete":
                delete_id = body["id"]
                # Check MinIO for connected resources
                search = media.Media.where(struct={"subject": f"Patient/{delete_id}"})
                media_resources = search.perform_resources(
                    self.fhir_client.client.server
                )
                for m in media_resources:
                    file = m.as_json()["content"]["url"].replace("wsi-storage/", "")
                    self.minio_client.client.remove_object(
                        "wsi-storage",
                        file,
                    )
                    # delete FHIR resource
                    # this doesn't require any code as the media resource deletion is handled by the webhook
                # Check Orthanc for connected resources
                search = imagingstudy.ImagingStudy.where(
                    struct={"subject": f"Patient/{delete_id}"}
                )
                imaging_studies = search.perform_resources(
                    self.fhir_client.client.server
                )
                for study in imaging_studies:
                    self.orthanc_client.orthanc.delete_studies_id(id_=study.id)

                    # delete FHIR resource
                    # this doesn't require any code as the imaging study resource deletion is handled by the webhook
                # We need to delay the patient deletion to give the webhooks time to finish executing, otherwise HAPI
                # will issue an error because the same resource is modified by two separate threads, but it'll still
                # delete everything. The sole purpose of this sleep is to get rid of that error.
                sleep(0.1)
                self.fhir_client.delete_patient(_id=delete_id)
                app_log.info(
                    f'{request.META["REMOTE_ADDR"]} - deleted patient {body["name"]}'
                )
                return HttpResponse(200)
            case "view":
                response = HttpResponse(200)
                response.headers["RetVal"] = "http://fhir:8080/fhir/Patient?"
                return HttpResponse(200)
            case _:
                raise NotImplementedError


@csrf_exempt
def MinIOWebhook(request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
    """
    Webhook that is called by the minio instance whenever a PUT or DELETE happens.

    Args:
    - request (HttpRequest): The HTTP request object.
    Returns:
    - HttpResponse: The HTTP response object.
    """

    def process_webhook(req: HttpRequest) -> HttpResponse:
        match req.method:
            case "POST":
                body: dict = json.loads(req.body)
                file_url_minio: str = body["Records"][0]["s3"]["object"]["key"].replace(
                    "%2F", "/"
                )
                bucket_name = body["Records"][0]["s3"]["bucket"]["name"]
                meta: dict = {"id": file_url_minio.split("/")[-2], "comment": ""}

                fhir_client = FHIRClient(fhir_base_url=FHIR_URL)  # fhir:8080/fhir
                minio_client = MinioClient(
                    endpoint=MINIO_URL,
                    access_key=MINIO_CREDENTIALS[0],
                    secret_key=MINIO_CREDENTIALS[1],
                )
                orthanc_client = OrthancClient(
                    orthanc_url=ORTHANC_URL,
                    username=ORTHANC_CREDENTIALS[0],
                    password=ORTHANC_CREDENTIALS[1],
                    meta=meta,
                )
                filepath = body["Key"]
                match body["EventName"]:
                    case "s3:ObjectRemoved:Delete":
                        fhir_client.delete_media(filepath.replace("/", "-"))
                        app_log.info(
                            f'{request.META["REMOTE_ADDR"]} - deleted {filepath} on S3'
                        )
                    case "s3:ObjectCreated:Put" | "s3:ObjectCreated:CompleteMultipartUpload":
                        # file resides in folder named after patient by definition
                        patient_name = Path(filepath).parents[0].name

                        task = threading.Thread(
                            target=convert_and_send,
                            args=(
                                minio_client,
                                orthanc_client,
                                bucket_name,
                                file_url_minio,
                                ORTHANC_WSI_CONVERSION_THREADS,
                            ),
                        )
                        task.start()

                        fhir_client.create_media(
                            patient_name=patient_name, file_url=filepath
                        )
                        app_log.info(
                            f'{request.META["REMOTE_ADDR"]} - uploaded {filepath} to S3'
                        )
                return HttpResponse(200)
            case _:
                return HttpResponse("You saw nothing, keep moving...")

    main_task = threading.Thread(
        target=process_webhook,
        args=[request],
    )
    main_task.start()
    return HttpResponse(200)


@csrf_exempt
def OrthancWebhook(request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
    """
    Events to be executed once Orthanc sends a "stable study" or "study deleted" notice.

    Args:
    - request (HttpRequest): The HTTP request object.
    Returns:
    - HttpResponse: The HTTP response object containing the rendered HTML template.
    """
    body = json.loads(request.body)
    study_reference = body["resource"]

    # Thread this at some point

    match int(body["event"]):
        case 9:
            # stable study
            task = threading.Thread(
                target=FHIR_CU,
                args=[study_reference],
            )
            task.start()
            # FHIR_CU(study_reference)
            app_log.info(
                f'{request.META["REMOTE_ADDR"]} - Create / Update : ImagingStudy {study_reference}'
            )
            # CRUD
            # with mp.Pool(processes=NUM_PROCESSES) as p:
            #     p.map(partial(FHIR_CU, (p_id, study_reference)),
            #           [{k: v} for k, v in ssi_info['studies'].items()])
        case 1:
            # Resource deleted
            match int(body["level"]):
                # I suspect this:
                # 0: patient
                # 1: study
                # 2: series
                # 3: instance
                case 1:
                    # study deleted
                    task = threading.Thread(
                        target=FHIR_D,
                        args=[study_reference],
                    )
                    task.start()
                    # FHIR_D(study_reference)
                    app_log.info(
                        f'{request.META["REMOTE_ADDR"]} - Delete : ImagingStudy {study_reference}'
                    )

    return HttpResponse(200)


def FHIR_CU(reference: str) -> None:
    """
    FHIR CREATE (C) and UPDATE (U) functionality.

    Args:
    - reference (str): reference of the FHIR resource to be altered
    Returns:
    - None
    """
    fhir_client = FHIRClient(fhir_base_url=FHIR_URL)  # fhir:8080/fhir
    with requests.Session() as session:
        session.auth = (ORTHANC_CREDENTIALS[0], ORTHANC_CREDENTIALS[1])

        study = imagingstudy.ImagingStudy()
        study.id = reference

        study_lookup = session.get(url=f"{ORTHANC_API}/studies/{reference}").json()
        patient_id = study_lookup["PatientMainDicomTags"]["PatientID"]
        study_uid = study_lookup["MainDicomTags"]["StudyInstanceUID"]
        _id = fhir_client.get_patientID(patient_id)

        identifier = Identifier()
        identifier.use = "official"
        identifier.value = study_uid
        study.identifier = [identifier]
        study.status = "available"
        reference = FHIRReference()
        reference.reference = f"Patient/{_id}"
        study.subject = reference
        study.series = []

        series_references = study_lookup["Series"]
        for series in series_references:
            series_lookup = session.get(url=f"{ORTHANC_API}/series/{series}").json()
            series = imagingstudy.ImagingStudySeries()
            series_uid = series_lookup["MainDicomTags"]["SeriesInstanceUID"]
            series_modality = series_lookup["MainDicomTags"]["Modality"]

            modality = Coding()
            modality.system = "https://dicom.nema.org/resources/ontology/DCM"
            modality.code = series_modality
            series.modality = modality
            series.uid = series_uid
            series.instance = []

            instances = series_lookup["Instances"]
            for instance in instances:
                instance_lookup = session.get(
                    f"{ORTHANC_API}/instances/{instance}"
                ).json()
                instance_uid = instance_lookup["MainDicomTags"]["SOPInstanceUID"]
                series_instance = imagingstudy.ImagingStudySeriesInstance()
                series_instance.uid = instance_uid
                sop_class = Coding()
                sop_class.system = "urn:ietf:rfc:3986"
                sop_class.code = "urn:oid:1.2.840.10008.5.1.4.1.1.66"
                series_instance.sopClass = sop_class
                series.instance.append(series_instance)

            study.series.append(series)
        fhir_client.create_imaging_study(study.as_json())


def FHIR_D(resource: str) -> None:
    """
    FHIR DELETE (D)

    Args:
    - reference (str): reference of the FHIR resource to be altered
    Returns:
    - None
    """
    fhir_client = FHIRClient(fhir_base_url=FHIR_URL)  # fhir:8080/fhir
    fhir_client.delete_imaging_study(_id=resource)


class StudyDashboard(ResourceConnector, TemplateView):
    """
    Class based view for the study dashboard.
    """

    def get(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        """
        Retrieves the upload page and renders it using the specified HTML template.

        Args:
        - request (HttpRequest): The HTTP request object.
        Returns:
        - HttpResponse: The HTTP response object containing the rendered HTML template.
        """
        template_name = "spa/study-dashboard.html"
        # testing
        fig = make_subplots(
            rows=1,
            cols=2,
            column_widths=[0.3, 0.7],
            specs=[[{"type": "domain"}, {"type": "xy"}]],
        )

        with requests.Session() as session:
            female_count = int(
                session.get(
                    f"{self.fhir_client.fhir_base_url}Patient?gender=female&_summary=count"
                ).json()["total"]
            )
            male_count = int(
                session.get(
                    f"{self.fhir_client.fhir_base_url}Patient?gender=male&_summary=count"
                ).json()["total"]
            )
            others_count = int(
                session.get(
                    f"{self.fhir_client.fhir_base_url}Patient?gender=other&_summary=count"
                ).json()["total"]
            )
            unknown_count = int(
                session.get(
                    f"{self.fhir_client.fhir_base_url}Patient?gender=unknown&_summary=count"
                ).json()["total"]
            )

            # total = int(session.get(f'{self.fhir_client.fhir_base_url}Patient?_summary=count').json()['total'])
            age = np.array(
                self.get_patient_ages(
                    session, url=f"{self.fhir_client.fhir_base_url}Patient?", ages=[]
                )
            )
            # np.save(file='test', arr=np.asarray(age), allow_pickle=True)

        sexes = {
            "Male": male_count if male_count > 0 else None,
            "Female": female_count if female_count > 0 else None,
            "Other": others_count if others_count > 0 else None,
            "Unknown": unknown_count if unknown_count > 0 else None,
        }
        colors = [
            "rgb(5, 155, 255)",
            "rgb(219, 141, 242)",
            "rgb(242, 222, 141)",
            "rgb(127, 127, 127)",
        ]
        marker = {"colors": colors}
        # Create a pie chart trace
        trace = go.Pie(
            labels=list(sexes.keys()),
            values=list(sexes.values()),
            hole=0.6,
            marker=marker,
        )
        pie_div = plot([trace], output_type="div")

        df = pd.DataFrame(data=age, columns=["age"])
        # Create a pie chart trace
        trace = go.Histogram(x=df["age"], showlegend=False, marker=dict(color="gray"))

        hist_div = plot([trace], output_type="div")
        return render(
            request, template_name, {"pie_div": pie_div, "hist_div": hist_div}
        )

    def get_patient_ages(
        self, sess: requests.session, url: str, ages: list, count: int = 0
    ) -> list:
        """
        Gets patient ages to populate the histogram in the dashboard.

        Args:
        - sess (requests.session): requests session to use
        - url (str): the url to check
        - ages (list): list of ages
        - count (int): count to check how many pages have been accessed
        Returns:
        - ages (list): all found ages
        """
        page = sess.get(url).json()
        if "entry" not in page:
            return []
        for entry in page["entry"]:
            try:
                dob = entry["resource"]["birthDate"]
                if len(dob) > 10:
                    dob = dob[:10]
                dob = datetime.strptime(dob, "%Y-%m-%d")
                # this is lazily done and can mean that ages are off by 1 year
                # also, gap years etc.
                # https://stackoverflow.com/questions/765797/convert-timedelta-to-years
                ages.append(int(datetime.now().year - dob.year))
            except (KeyError, ValueError):
                pass
        # pbar.update(len(page['entry']))
        if "link" in page:
            for link in page["link"]:
                if link["relation"] == "next":
                    self.get_patient_ages(sess, url=link["url"], ages=ages, count=count)
        return ages
