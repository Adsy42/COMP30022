"""Authentication decorators and utilities."""
from functools import wraps
from flask import request, jsonify, current_app
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from ..models.user import User


def token_required(f):
    """Decorator to require JWT token for endpoint access."""

    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": "Unauthorized", "message": str(e)}), 401

    return decorated


def admin_required(f):
    """Decorator to require admin role for endpoint access."""

    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            verify_jwt_in_request()
            username = get_jwt_identity()

            # Verify user exists and is admin
            user = User.find_by_username(current_app.db, username)
            if not user or user.role != "admin" or not user.is_active:
                return jsonify({"error": "Forbidden", "message": "Admin access required"}), 403

            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": "Unauthorized", "message": str(e)}), 401

    return decorated
