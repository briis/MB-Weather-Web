"""This module contains the main package information for the Flask webserver."""

from __future__ import annotations

import os

from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
load_dotenv()
DB_HOST = os.getenv("HOST")
DB_PORT = os.getenv("PORT")
DB_USER = os.getenv("USER")
DB_PASSWORD = os.getenv("PASSWORD")
DB_DATABASE = os.getenv("DATABASE")


def create_app():
    """Create Flask App."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "e0c7d617-bfa6-486c-b11d-9d60eb13c4fe"
    # app.config["MYSQL_HOST"] = DB_HOST
    # app.config["MYSQL_USER"] = DB_USER
    # app.config["MYSQL_PASSWORD"] = DB_PASSWORD
    # app.config["MYSQL_DB"] = DB_DATABASE
    # app.config["SQLALCHEMY_DATABASE_URI"] = (
    #     f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_DATABASE}"
    # )
    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    # db.init_app(app)

    from .views import views

    app.register_blueprint(views, url_prefix="/")

    # with app.app_context():
    #     db.create_all()


    return app
