FROM python:3.7-alpine AS base

FROM base AS builder
RUN mkdir /install
WORKDIR /install
COPY requirements.txt /requirements.txt
RUN pip install --install-option="--prefix=/install" -r /requirements.txt

FROM base
COPY --from=builder /install /usr
COPY ./src /app
WORKDIR /app
CMD ["python", "hello.py"]
