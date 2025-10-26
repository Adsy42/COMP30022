"""API endpoints for form questions configuration."""

from flask import Blueprint, jsonify, request, current_app
from app.models.form_question import FormQuestion
from app.utils.auth import admin_required

bp = Blueprint("form_questions", __name__, url_prefix="/api/form-questions")


@bp.route("", methods=["GET"])
def get_form_questions():
    """
    Get all form questions.

    Returns:
        200: List of form questions ordered by their order field
        {
            "data": [
                {
                    "id": "1",
                    "question": "Your name",
                    "type": "text",
                    "options": null,
                    "order": 0
                },
                ...
            ]
        }
    """
    try:
        questions = FormQuestion.get_all(current_app.db)
        return jsonify({"data": [q.to_dict() for q in questions]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("", methods=["POST"])
@admin_required
def create_or_update_questions():
    """
    Create or update form questions (bulk operation).
    Admin only.

    Request body:
        {
            "questions": [
                {
                    "id": "1",
                    "question": "Your name",
                    "type": "text",
                    "options": null,
                    "order": 0
                },
                ...
            ]
        }

    Returns:
        200: Questions updated successfully
        400: Invalid request body
    """
    try:
        data = request.get_json()
        if not data or "questions" not in data:
            return jsonify({"error": "questions field is required"}), 400

        questions = data["questions"]
        if not isinstance(questions, list):
            return jsonify({"error": "questions must be an array"}), 400

        # Validate each question has required fields
        for q in questions:
            if not all(k in q for k in ["id", "question", "type", "order"]):
                return (
                    jsonify(
                        {
                            "error": "Each question must have id, question, type, and order"
                        }
                    ),
                    400,
                )

        FormQuestion.bulk_insert(current_app.db, questions)
        return jsonify({"message": "Form questions updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/reorder", methods=["POST"])
@admin_required
def reorder_questions():
    """
    Reorder form questions.
    Admin only.

    Request body:
        {
            "order": ["1", "3", "2", "4"]  // Array of question IDs in new order
        }

    Returns:
        200: Questions reordered successfully
        400: Invalid request body
    """
    try:
        data = request.get_json()
        if not data or "order" not in data:
            return jsonify({"error": "order field is required"}), 400

        new_order = data["order"]
        if not isinstance(new_order, list):
            return jsonify({"error": "order must be an array"}), 400

        success = FormQuestion.reorder(current_app.db, new_order)
        if success:
            return jsonify({"message": "Questions reordered successfully"}), 200
        else:
            return jsonify({"error": "Failed to reorder questions"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/<question_id>", methods=["GET"])
def get_question(question_id):
    """
    Get a specific form question by ID.

    Returns:
        200: Question data
        404: Question not found
    """
    try:
        question = FormQuestion.get_by_id(current_app.db, question_id)
        if not question:
            return jsonify({"error": "Question not found"}), 404

        return jsonify(question.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
