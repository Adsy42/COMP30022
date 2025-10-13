"""Configuration API endpoints."""
from flask import Blueprint, jsonify, request, current_app
from ..models.config import AppConfig
from ..utils.auth import token_required
from ..utils.validators import validate_email

bp = Blueprint("config", __name__, url_prefix="/config")


@bp.route("/email-recipient", methods=["PUT"])
@token_required
def update_email_recipient():
    """
    PUT /config/email-recipient
    Update escalation recipient email.
    Body: {
        "email_address": "email@example.com"
    }
    Returns: boolean (true if successful)
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        email_address = data.get("email_address")

        if not email_address:
            return jsonify({"error": "email_address field is required"}), 400

        # Validate email format
        if not validate_email(email_address):
            return jsonify({"error": "Invalid email format"}), 422

        # Update config
        AppConfig.set(
            current_app.db,
            "escalation_email",
            email_address,
            description="Escalation recipient email address",
        )

        return jsonify(True), 200

    except Exception as e:
        current_app.logger.error(f"Error updating email recipient: {str(e)}")
        return jsonify({"error": "Failed to update email recipient", "message": str(e)}), 500
