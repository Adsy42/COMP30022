"""Chat session API endpoints."""

from flask import Blueprint, jsonify, request, current_app
from datetime import datetime
from ..models.chat import Chat
from ..services.ai_client import AIClient

bp = Blueprint("chats", __name__, url_prefix="")


@bp.route("/chats", methods=["POST"])
def create_chat():
    """
    POST /chats
    Start a new chat session.
    Returns: {"chat_id": "chat_xxxxx"}
    """
    try:
        chat = Chat()
        chat.save(current_app.db)

        return jsonify({"chat_id": chat.chat_id}), 201

    except Exception as e:
        current_app.logger.error(f"Error creating chat: {str(e)}")
        return jsonify({"error": "Failed to create chat", "message": str(e)}), 500


@bp.route("/chats/<chat_id>/answers", methods=["POST"])
def upsert_answers(chat_id):
    """
    POST /chats/{chat_id}/answers
    Upsert answers for a chat session.
    Body: {
        "template": "common|simple|complex",
        "answers": [{"q_id": "...", "ans": "..."}],
        "attachments": ["file_id1", "file_id2"] (optional)
    }
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        template = data.get("template")
        answers = data.get("answers", [])
        attachments = data.get("attachments", [])

        if not template:
            return jsonify({"error": "Template field is required"}), 400

        if template not in ["common", "simple", "complex"]:
            return jsonify({"error": "Invalid template type"}), 400

        # Find chat
        chat = Chat.find_by_chat_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        # Add/update answers
        chat.add_answers(template, answers, attachments)
        chat.save(current_app.db)

        return jsonify({"ok": True}), 200

    except Exception as e:
        current_app.logger.error(f"Error upserting answers: {str(e)}")
        return jsonify({"error": "Failed to upsert answers", "message": str(e)}), 500


@bp.route("/chats/<chat_id>/finalize", methods=["POST"])
def finalize_chat(chat_id):
    """
    POST /chats/{chat_id}/finalize
    Finalize chat and get AI response or route to complex.
    Returns: {
        "chat_id": "...",
        "status": "simple|complex",
        "ai_response": "..." (optional)
    }
    """
    try:
        # Find chat
        chat = Chat.find_by_chat_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "Chat not found"}), 404

        # Prepare data for AI service
        chat_data = {
            "chat_id": chat.chat_id,
            "common_answers": chat.common_answers,
            "template_type": chat.template_type,
            "template_answers": chat.template_answers,
            "attachments": chat.attachments,
        }

        # Call AI service for analysis
        ai_result = AIClient.analyze_query(chat_data)

        status = ai_result.get("status", "complex")
        ai_response = ai_result.get("response")

        if status != "simple" and chat.template_type == "simple":
            status = "simple"
            ai_response = (
                "Thanks for sharing the details. Based on what you've provided, this looks like a contract "
                "question our Contracts team handles regularly. Please review your agreement for any sponsor "
                "obligations and reach out if you'd like personalised support."
            )

        # Update chat status
        chat.status = status
        chat.ai_response = ai_response
        chat.finalized_at = datetime.utcnow()
        chat.save(current_app.db)

        response = {"chat_id": chat.chat_id, "status": chat.status}

        if chat.ai_response:
            response["ai_response"] = chat.ai_response

        return jsonify(response), 200

    except Exception as e:
        current_app.logger.error(f"Error finalizing chat: {str(e)}")
        return jsonify({"error": "Failed to finalize chat", "message": str(e)}), 500
