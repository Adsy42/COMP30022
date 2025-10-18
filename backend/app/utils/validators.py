"""Validation utilities."""
import re
from flask import current_app


def validate_email(email):
    """Validate email format."""
    if not email:
        return False
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def validate_template_type(template_type):
    """Validate template type."""
    valid_types = ["common", "simple", "complex"]
    return template_type in valid_types


def allowed_file(filename):
    """Check if file extension is allowed."""
    if not filename or "." not in filename:
        return False
    extension = filename.rsplit(".", 1)[1].lower()
    return extension in current_app.config["ALLOWED_EXTENSIONS"]
