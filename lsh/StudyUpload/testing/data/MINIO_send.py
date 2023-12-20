# -*- coding: utf-8 -*-
from minio import Minio
from dotenv import dotenv_values


class MinioClient:
    def __init__(
        self, endpoint: str, access_key: str = None, secret_key: str = None
    ) -> None:
        self.endpoint = endpoint
        self._access_key = access_key
        self._secret_key = secret_key
        if (self._access_key is None) or (self._secret_key is None):
            # try to load credentials from .env
            env_path = r"environments/minio/minio.env"
            try:
                config = dotenv_values(env_path)
                self._access_key = config["MINIO_ROOT_USER"]
                self._secret_key = config["MINIO_ROOT_PASSWORD"]
            except (FileNotFoundError, KeyError):
                raise ValueError(f"No credentials supplied for MinIO client")

        self.client = Minio(
            endpoint=self.endpoint,
            access_key=self._access_key,
            secret_key=self._secret_key,
            secure=False,
        )

    def send_to_bucket(
        self,
        bucket_name: str,
        file: str,
        directory: str = None,
        name_on_storage: str = None,
    ) -> None:
        """Sends a file to an existing bucket"""
        exists = self.client.bucket_exists(bucket_name)

        if not exists:
            self.client.make_bucket(bucket_name=bucket_name)

        if name_on_storage is None:
            name_on_storage = str(file).split("/")[-1]
        if directory is not None:
            name_on_storage = f"{directory}/{name_on_storage}"
        self.client.fput_object(
            bucket_name=bucket_name, object_name=name_on_storage, file_path=file
        )
