"""Admin authentication API endpoints."""
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import create_access_token
from ..models.user import User

bp = Blueprint("admin", __name__, url_prefix="")


@bp.route("/login", methods=["POST"])
def login():
    """
    POST /login
    Admin login endpoint.
    Body: {
        "username": "admin",
        "password": "password"
    }
    Returns: {
        "success": true,
        "token": "jwt_token"
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Find user by username or email
        user = User.find_by_username(current_app.db, username)
        if not user:
            user = User.find_by_email(current_app.db, username)

        if not user or not user.check_password(password):
            return jsonify({"success": False, "token": None}), 200

        if not user.is_active:
            return jsonify({"success": False, "token": None}), 200

        # Create JWT token
        access_token = create_access_token(identity=username)

        return jsonify({"success": True, "token": access_token}), 200

    except Exception as e:
        current_app.logger.error(f"Error during login: {str(e)}")
        return jsonify({"error": "Login failed", "message": str(e)}), 500
