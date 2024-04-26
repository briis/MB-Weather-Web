"""This module is the entry point for Flask Web Server."""

from __future__ import annotations
from website import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5003)
