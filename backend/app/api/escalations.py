"""Escalation API endpoints."""

from flask import Blueprint, jsonify, request, current_app
from ..models.chat import Chat
from ..models.config import AppConfig
from ..services.email_service import EmailService

bp = Blueprint("escalations", __name__, url_prefix="")


@bp.route("/escalations", methods=["POST"])
def create_escalation():
    """
    POST /escalations
    Mark simple query outcome (escalate or complete).
    Body: {
        "chat_id": "chat_xxxxx",
        "escalate": true/false,
        "reason": "..." (optional)
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        chat_id = data.get("chat_id")
        escalate = data.get("escalate")

        if not chat_id or escalate is None:
            return jsonify({"error": "chat_id and escalate fields are required"}), 400

        # Find chat
        chat = Chat.find_by_chat_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "chat_id not found"}), 404

        # Update escalation status
        chat.escalated = escalate

        if escalate:
            chat.escalation_reason = data.get("reason")
            chat.status = "complex"  # Escalated queries are treated as complex

            # Get recipient email from config
            recipient_email = AppConfig.get(
                current_app.db,
                "escalation_email",
                default="ric-contracts@unimelb.edu.au",
            )

            # Send escalation email
            chat_data = chat.to_dict()
            EmailService.send_escalation_email(recipient_email, chat_data)

        chat.save(current_app.db)

        return jsonify({"ok": True}), 200

    except Exception as e:
        current_app.logger.error(f"Error processing escalation: {str(e)}")
        return (
            jsonify({"error": "Failed to process escalation", "message": str(e)}),
            500,
        )
