# -*- coding: utf-8 -*-
# This file defines a function that handles the conversion of WSI files to DICOM and sends them to the PACS
import os
from tempfile import NamedTemporaryFile, TemporaryDirectory

# Maybe exchange this for a os.system('dpkg -L libopenslide0')[-1] at some point
# r = os.system('dpkg -L libopenslide0')
libopenslide0_location = r"/usr/lib/aarch64-linux-gnu/libopenslide.so.0"
dicom_dataset_path = "/lsh/StudyUpload/testing/data/dicom_dataset.json"


def convert_and_send(
    minio_client,
    orthanc_client,
    bucket_name: str,
    url_on_minio: str,
    conversion_threads: int = 2,
) -> None:
    try:
        response = minio_client.client.get_object(bucket_name, url_on_minio)
        # Read data from response.
        with TemporaryDirectory() as temp_dir:
            with NamedTemporaryFile(mode="wb", suffix=".svs") as temporary:
                temporary.write(response.data)
                os.system(
                    # f'OrthancWSIDicomizer {temporary.name} --openslide={libopenslide0_location}
                    # --orthanc=http://orthanc:8042 --username=demo --password=demo')
                    f"OrthancWSIDicomizer {temporary.name} --threads={conversion_threads} \
                    --openslide={libopenslide0_location} --folder={temp_dir} --dataset={dicom_dataset_path}"
                )
            dicom_files = [
                os.path.join(temp_dir, f)
                for f in os.listdir(temp_dir)
                if f.endswith(".dcm")
            ]
            for dcm in dicom_files:
                orthanc_client.pseudonymize_and_send(dcm)
            # with mp.Pool(processes=sending_processes) as p:
            #     p.map(orthanc_client.pseudonymize_and_send, dicom_files)
    finally:
        response.close()
        response.release_conn()


# if __name__ == '__main__':
#     # This test case OBVIOUSLY DOES NOT work locally
#     minio_client = minio.Minio(
#         endpoint=r'0.0.0.0:9000',
#         access_key='demo',
#         secret_key='demodemo',
#         secure=False
#     )
#
#     convert_and_send(minio_client, 'wsi-storage/WSI-Test/tmp4yrhftqx.upload.svs')
