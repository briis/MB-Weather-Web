FROM python:3.13-bookworm
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /app
COPY ./website/.env /app/website/.env
EXPOSE 5003
CMD ["gunicorn", "-w", "5", "-b", "0.0.0.0:5003", "run:app"]