FROM python:3.10.0-alpine

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./src /code/src
COPY ./config /code/config
COPY ./resources /code/resources
COPY ./main.py /code/main.py
COPY ./app.py /code/app.py

CMD ["python3", "app.py"]