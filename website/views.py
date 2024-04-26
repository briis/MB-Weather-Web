"""This module contains Blueprint for anything except Authorization."""

from __future__ import annotations

from flask import Blueprint, render_template, request, jsonify
from pymeteobridgesql import MeteobridgeSQL

# from . import db
# from .models import (
#     ActiveTypes,
#     Departments,
#     Employees,
#     Genders,
#     IncomeTypes,
#     LeaveTypes,
#     RoleTypes,
# )

views = Blueprint("views", __name__)


@views.route("/")
def home():
    return render_template("home.html")


# @views.route("/api/data", methods=["GET"])
# def data():
#     query = Employees.query

#     # SearchPanes
#     searchpanes = {"options": {}}
#     sp_fields = ["active_employee", "departmentID", "gender", "role_type", "manager"]

#     for sp_field in sp_fields:
#         names = [
#             row[0]
#             for row in Employees.query.with_entities(
#                 getattr(Employees, sp_field)
#             ).distinct()
#         ]
#         searchpanes["options"][sp_field] = []
#         for name in names:
#             display_name = name
#             if sp_field == "active_employee":
#                 display_name = db.session.query(ActiveTypes).get(name).description
#             if sp_field == "departmentID":
#                 display_name = db.session.query(Departments).get(name).description
#             if sp_field == "gender":
#                 display_name = db.session.query(Genders).get(name).description
#             if sp_field == "role_type":
#                 display_name = db.session.query(RoleTypes).get(name).description
#             if sp_field == "manager":
#                 display_name = db.session.query(Employees).get(name).fullname
#             name_d = {
#                 "label": display_name,
#                 "total": query.filter(getattr(Employees, sp_field) == name).count(),
#                 "value": name,
#                 "count": query.filter(getattr(Employees, sp_field) == name).count(),
#             }
#             searchpanes["options"][sp_field].append(name_d)
#         # SearchPane Filters
#         if request.args.get(f"searchPanes[{sp_field}][0]"):
#             sp_filter = []
#             i = 0
#             while True:
#                 col_name = request.args.get(f"searchPanes[{sp_field}][{i}]")
#                 if col_name is None:
#                     break
#                 sp_filter.append(col_name)
#                 i += 1
#             query = query.filter(getattr(Employees, sp_field).in_(sp_filter))

#     # Search Filter
#     search = request.args.get("search[value]")
#     if search:
#         query = query.filter(
#             db.or_(
#                 Employees.fullname.like(f"%{search}%"),
#                 Employees.title.like(f"%{search}%"),
#                 Employees.departmentID.like(f"%{search}%"),
#                 Employees.salary_type.like(f"%{search}%"),
#                 Employees.address.like(f"%{search}%"),
#                 Employees.zip_code.like(f"%{search}%"),
#                 Employees.city.like(f"%{search}%"),
#                 Employees.email.like(f"%{search}%"),
#                 Employees.mobile_phone.like(f"%{search}%"),
#             )
#         )

#     # Query Builder
#     cnt = 0
#     filter_criteria = []
#     while True:
#         condition = request.args.get(f"searchBuilder[criteria][{cnt}][condition]")
#         if condition is None:
#             break
#         logic = request.args.get(f"searchBuilder[logic]")
#         field = request.args.get(f"searchBuilder[criteria][{cnt}][origData]")
#         value = request.args.get(f"searchBuilder[criteria][{cnt}][value1]")
#         value2 = request.args.get(f"searchBuilder[criteria][{cnt}][value2]", None)
#         filter_criteria.append((condition, field, value, value2, logic))
#         cnt += 1
#     # Build the filter query based on the filter criteria
#     for condition, field, value, value2, logic in filter_criteria:
#         if condition == "contains":
#             query = query.filter(getattr(Employees, field).ilike(f"%{value}%"))
#         elif condition == "=":
#             query = query.filter(getattr(Employees, field) == value)
#         elif condition == "!=":
#             query = query.filter(getattr(Employees, field) != value)
#         elif condition == ">":
#             query = query.filter(getattr(Employees, field) > value)
#         elif condition == "<":
#             query = query.filter(getattr(Employees, field) < value)
#         elif condition == ">=":
#             query = query.filter(getattr(Employees, field) >= value)
#         elif condition == "<=":
#             query = query.filter(getattr(Employees, field) <= value)
#         elif condition == "null":
#             query = query.filter(getattr(Employees, field) is None)
#         elif condition == "!null":
#             query = query.filter(getattr(Employees, field) is not None)
#         elif condition == "between":
#             query = query.filter(getattr(Employees, field).between(value, value2))
#         elif condition == "!between":
#             query = query.filter(~getattr(Employees, field).between(value, value2))

#     total_filtered = query.count()

#     # sorting
#     order = []
#     i = 0
#     while True:
#         col_index = request.args.get(f"order[{i}][column]")
#         if col_index is None:
#             break
#         col_name = request.args.get(f"columns[{col_index}][data]")
#         # if col_name not in ['ID', 'fullname', 'title', 'email']:
#         #     col_name = 'fullname'
#         descending = request.args.get(f"order[{i}][dir]") == "desc"
#         col = getattr(Employees, col_name)
#         if descending:
#             col = col.desc()
#         order.append(col)
#         i += 1
#     if order:
#         query = query.order_by(*order)

#     # pagination
#     # start = request.args.get('start', type=int, default=-1)
#     # length = request.args.get('length', type=int, default=-1)
#     # if start != -1 and length != -1:
#     #     query = query.offset(start).limit(length)

#     return {
#         "data": [employees.to_dict() for employees in query],
#         "recordsFiltered": total_filtered,
#         "recordsTotal": Employees.query.count(),
#         "draw": request.args.get("draw", type=int, default=0),
#         "searchPanes": searchpanes,
#     }


# @views.route("/api/data", methods=["POST"])
# def update_employee():
#     data = request.json
#     json_data = data["data"]
#     for row in json_data:
#         id = row
#         row_data = json_data[id]
#         employee: Employees = Employees.query.get(id)
#         employee.fullname = row_data["fullname"]
#         employee.title = row_data["title"]
#         employee.departmentID = row_data["departmentID"]
#         employee.address = row_data["address"]
#         employee.zip_code = row_data["zip_code"]
#         employee.city = row_data["city"]
#         employee.email = row_data["email"]
#         employee.mobile_phone = row_data["mobile_phone"]
#         employee.gender = row_data["gender"]
#         employee.monthly_salary = row_data["monthly_salary"]
#         employee.salary_type = row_data["salary_type"]
#         employee.hours_per_month = row_data["hours_per_month"]
#         employee.birth_date = row_data["birth_date"]
#         employee.role_type = row_data["role_type"]
#         employee.operational_role = row_data["operational_role"]
#         employee.is_manager = row_data["is_manager"]
#         employee.manager = row_data["manager"]
#         if len(row_data["termination_date"]) != 0:
#             employee.termination_date = row_data["termination_date"]
#         if len(row_data["leave_type"]) != 0:
#             employee.leave_type = row_data["leave_type"]
#         if len(row_data["wanted_leave"]) != 0:
#             employee.wanted_leave = row_data["wanted_leave"]
#         db.session.commit()
#         break

#     employee = Employees.query.get(id)
#     return jsonify(employee.to_dict())


# @views.route("/api/departments", methods=["GET"])
# def departments():
#     result = Departments.query.all()

#     return jsonify(
#         [
#             {"id": department.id, "description": department.description}
#             for department in result
#         ]
#     )


# @views.route("/api/salarytypes", methods=["GET"])
# def salarytypes():
#     result = IncomeTypes.query.all()

#     return jsonify(
#         [
#             {"id": incometypes.id, "description": incometypes.description}
#             for incometypes in result
#         ]
#     )


# @views.route("/api/genders", methods=["GET"])
# def genders():
#     result = Genders.query.all()

#     return jsonify(
#         [{"id": genders.id, "description": genders.description} for genders in result]
#     )


# @views.route("/api/roletype", methods=["GET"])
# def roletype():
#     result = RoleTypes.query.all()

#     return jsonify(
#         [
#             {"id": roletypes.id, "description": roletypes.description}
#             for roletypes in result
#         ]
#     )


# @views.route("/api/manager", methods=["GET"])
# def manager():
#     result = Employees.query.filter(Employees.is_manager).all()

#     return jsonify(
#         [{"id": managers.ID, "description": managers.fullname} for managers in result]
#     )


# @views.route("/api/leavetypes", methods=["GET"])
# def leavetypes():
#     result = LeaveTypes.query.all()

#     return jsonify(
#         [
#             {"id": leavetypes.id, "description": leavetypes.description}
#             for leavetypes in result
#         ]
#     )
