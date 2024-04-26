FROM python:3.12-bookworm
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /app
COPY ./website/.env /app/website/.env
EXPOSE 5002
ENV FLASK_APP=main.py
CMD ["flask", "run", "--host", "0.0.0.0", "--port", "5002"]