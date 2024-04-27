"""This module contains Blueprint for anything except Authorization."""

from __future__ import annotations

from flask import Blueprint, current_app, render_template, jsonify
from pymeteobridgesql import MeteobridgeSQL, RealtimeData

views = Blueprint("views", __name__)


@views.route("/")
def home():

    return render_template("home.html", title=current_app.config["WEB_TITLE"], version=current_app.config["VERSION"])

@views.route("/api/data", methods=["GET"])
async def data():
    weather = MeteobridgeSQL(current_app.config["MYSQL_HOST"], current_app.config["MYSQL_USER"], current_app.config["MYSQL_PASSWORD"], current_app.config["MYSQL_DB"])
    await weather.async_init()
    result: RealtimeData = await weather.async_get_realtime_data(current_app.config["STATION_ID"])
    await weather.async_disconnect()

    return jsonify(result.to_dict())
