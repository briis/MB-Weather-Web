"""This module contains the main package information for the Flask webserver."""

from __future__ import annotations

import os

from dotenv import load_dotenv
from flask import Flask

from .const import VERSION, WEB_TITLE

def create_app():
    load_dotenv()

    """Create Flask App."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "e0c7d617-bfa6-486c-b11d-9d60eb13c4fe"
    app.config["MYSQL_HOST"] = os.getenv("HOST")
    app.config["MYSQL_USER"] = os.getenv("USER")
    app.config["MYSQL_PASSWORD"] = os.getenv("PASSWORD")
    app.config["MYSQL_DB"] = os.getenv("DATABASE")
    app.config["STATION_ID"] = os.getenv("STATION_ID")
    app.config["VERSION"] = VERSION
    app.config["WEB_TITLE"] = WEB_TITLE

    from .views import views

    app.register_blueprint(views, url_prefix="/")

    return app
