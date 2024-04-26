"""This module defines the user database for the Program."""

from __future__ import annotations

import datetime

from . import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    """This class defines the User Table."""

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))


class Employees(db.Model):
    """This class defines the Employee Table."""

    __tablename__ = "employees"
    ID = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(100), nullable=False)
    cpr = db.Column(db.String(10), default=None)
    title = db.Column(db.String(100), default=None)
    employment_date = db.Column(db.Date, nullable=False)
    termination_date = db.Column(db.Date, default=None)
    active_employee = db.Column(db.SmallInteger, nullable=False)
    departmentID = db.Column(db.Integer, default=None)
    salary_type = db.Column(db.Integer, default=None)
    address = db.Column(db.String(100), default=None)
    zip_code = db.Column(db.Integer, default=None)
    city = db.Column(db.String(100), default=None)
    email = db.Column(db.String(100), default=None)
    mobile_phone = db.Column(db.String(100), default=None)
    gender = db.Column(db.SmallInteger, nullable=False)
    monthly_salary = db.Column(db.Numeric(10, 2), default=None)
    hours_per_month = db.Column(db.Numeric(5, 2), default=160.33)
    birth_date = db.Column(db.Date, default=None)
    operational_role = db.Column(db.SmallInteger, default=False)
    is_manager = db.Column(db.SmallInteger, default=False)
    wanted_leave = db.Column(db.SmallInteger, default=None)
    leave_type = db.Column(db.Integer, default=None)
    role_type = db.Column(db.Integer, default=None)
    manager = db.Column(db.Integer, default=None)
    vacation_used = db.Column(db.Numeric(5, 2), default=0.00)
    vacation_booked = db.Column(db.Numeric(5, 2), default=0.00)

    @property
    def formatted_gender(self):
        return db.session.query(Genders).get(self.gender).description

    @property
    def age(self):
        if self.birth_date:
            today = datetime.date.today()
            age = (
                today.year
                - self.birth_date.year
                - (
                    (today.month, today.day)
                    < (self.birth_date.month, self.birth_date.day)
                )
            )
            return age
        return None

    @property
    def formatted_active_employee(self):
        return db.session.query(ActiveTypes).get(self.active_employee).description

    def to_dict(self):
        return {
            "ID": self.ID,
            "fullname": self.fullname,
            "cpr": self.cpr,
            "title": self.title,
            "employment_date": self.employment_date,
            "termination_date": self.termination_date,
            "active_employee": self.formatted_active_employee,
            "departmentID": self.departmentID,
            "salary_type": self.salary_type,
            "address": self.address,
            "zip_code": self.zip_code,
            "city": self.city,
            "email": self.email,
            "mobile_phone": self.mobile_phone,
            "gender": self.gender,
            "monthly_salary": self.monthly_salary,
            "age": self.age,
            "hours_per_month": self.hours_per_month,
            "birth_date": self.birth_date,
            "operational_role": self.operational_role,
            "is_manager": self.is_manager,
            "wanted_leave": self.wanted_leave,
            "leave_type": self.leave_type,
            "role_type": self.role_type,
            "manager": self.manager,
            "vacation_used": self.vacation_used,
            "vacation_booked": self.vacation_booked,
        }


class Departments(db.Model):
    """This class defines the Department Table."""

    __tablename__ = "departments"
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(30), nullable=False)
    manager = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String(10), nullable=False)
    expense_split = db.Column(db.String(10), nullable=False)


class IncomeTypes(db.Model):
    """This class defines the Income Types Table."""

    __tablename__ = "income_types"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(30), nullable=False)


class Genders(db.Model):
    """This class defines the Genders Table."""

    __tablename__ = "genders"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(30), nullable=False)


class RoleTypes(db.Model):
    """This class defines the Role Types Table."""

    __tablename__ = "role_types"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(30), nullable=False)


class ActiveTypes(db.Model):
    """This class defines the Active Types Table."""

    __tablename__ = "active_types"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(30), nullable=False)


class LeaveTypes(db.Model):
    """This class defines the Leave Types Table."""

    __tablename__ = "leave_types"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(50), nullable=False)
