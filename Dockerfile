FROM python:3.12-bookworm
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /app
COPY ./website/.env /app/website/.env
EXPOSE 5003
ENV FLASK_APP run.py
ENV FLASK_ENV production
CMD ["gunicorn", "--bind", "0.0.0.0:5003"]
