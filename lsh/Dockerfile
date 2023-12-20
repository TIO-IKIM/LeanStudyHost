FROM python:3.10

RUN apt update && apt install -y \
    ca-certificates \
    libgirepository1.0-dev \
    zlib1g-dev \
    libjpeg-dev \
    libpng-dev \
    orthanc-wsi \
    libopenslide0

COPY . /temp
WORKDIR /temp

RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python3", "-u", "manage.py", "runserver", "0.0.0.0:8000"]
