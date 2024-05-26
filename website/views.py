"""This module contains Blueprint for anything except Authorization."""

from __future__ import annotations

from flask import Blueprint, current_app, render_template, jsonify, url_for
from dataclasses import asdict as as_dict
from pymeteobridgesql import MeteobridgeSQL, RealtimeData, ForecastDaily, ForecastHourly
from pymeteobridgesql.data import MinuteData, MonthlyData

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


@views.route("/api/daily", methods=["GET"])
async def daily():
    weather = MeteobridgeSQL(current_app.config["MYSQL_HOST"], current_app.config["MYSQL_USER"], current_app.config["MYSQL_PASSWORD"], current_app.config["MYSQL_DB"])
    await weather.async_init()
    result: ForecastDaily = await weather.async_get_forecast(False)
    await weather.async_disconnect()

    result_array = []
    for row in result:
        result_array.append(row.__dict__)
    return jsonify(result_array)


@views.route("/api/hourly", methods=["GET"])
async def hourly():
    weather = MeteobridgeSQL(current_app.config["MYSQL_HOST"], current_app.config["MYSQL_USER"], current_app.config["MYSQL_PASSWORD"], current_app.config["MYSQL_DB"])
    await weather.async_init()
    result: ForecastHourly = await weather.async_get_forecast(True)
    await weather.async_disconnect()

    result_array = []
    for row in result:
        result_array.append(row.__dict__)
    return jsonify(result_array)


@views.route("/api/minute_data", methods=["GET"])
async def minute_data():
    weather = MeteobridgeSQL(current_app.config["MYSQL_HOST"], current_app.config["MYSQL_USER"], current_app.config["MYSQL_PASSWORD"], current_app.config["MYSQL_DB"])
    await weather.async_init()
    result: MinuteData = await weather.async_get_minute_data(24)
    await weather.async_disconnect()

    result_array = []
    for row in result:
        result_array.append(row.__dict__)
    return jsonify(result_array)



@views.route("/api/daily_data", methods=["GET"])
async def daily_data():
    weather = MeteobridgeSQL(current_app.config["MYSQL_HOST"], current_app.config["MYSQL_USER"], current_app.config["MYSQL_PASSWORD"], current_app.config["MYSQL_DB"])
    await weather.async_init()
    result: MonthlyData = await weather.async_get_daily_data(31)
    await weather.async_disconnect()

    result_array = []
    for row in result:
        result_array.append(row.__dict__)
    return jsonify(result_array)


@views.route("/api/monthly_data", methods=["GET"])
async def monthly_data():
    weather = MeteobridgeSQL(current_app.config["MYSQL_HOST"], current_app.config["MYSQL_USER"], current_app.config["MYSQL_PASSWORD"], current_app.config["MYSQL_DB"])
    await weather.async_init()
    result: MonthlyData = await weather.async_get_monthly_data(1)
    await weather.async_disconnect()

    result_array = []
    for row in result:
        result_array.append(row.__dict__)
    return jsonify(result_array)

