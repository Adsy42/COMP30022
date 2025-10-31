"""API endpoints for form questions configuration."""

from flask import Blueprint, jsonify, request, current_app
from app.models.form_question import FormQuestion
from app.utils.auth import admin_required

bp = Blueprint("form_questions", __name__, url_prefix="/api/form-questions")


@bp.route("", methods=["GET"])
def get_form_questions():
    """
    Get all form questions from templates.

    Returns all questions from common, simple, and complex templates combined.
    """
    try:
        from app.models.template import Template

        # Fetch all three templates
        common = Template.find_by_type(current_app.db, "common")
        simple = Template.find_by_type(current_app.db, "simple")
        complex = Template.find_by_type(current_app.db, "complex")

        # Combine all questions with order preserved
        all_questions = []
        order = 0

        # Add common questions first
        if common:
            for q in common.questions:
                all_questions.append(
                    {
                        "id": q.get("id"),
                        "question": q.get("question"),
                        "type": q.get("type"),
                        "options": q.get("options"),
                        "order": order,
                    }
                )
                order += 1

        # Add simple questions
        if simple:
            for q in simple.questions:
                all_questions.append(
                    {
                        "id": q.get("id"),
                        "question": q.get("question"),
                        "type": q.get("type"),
                        "options": q.get("options"),
                        "order": order,
                    }
                )
                order += 1

        # Add complex questions
        if complex:
            for q in complex.questions:
                all_questions.append(
                    {
                        "id": q.get("id"),
                        "question": q.get("question"),
                        "type": q.get("type"),
                        "options": q.get("options"),
                        "order": order,
                    }
                )
                order += 1

        return jsonify({"data": all_questions}), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching form questions: {str(e)}")
        return jsonify({"error": str(e)}), 500


@bp.route("", methods=["POST"])
@admin_required
def create_or_update_questions():
    """
    Create or update form questions (bulk operation).
    Admin only.

    This now saves to templates collection instead of form_questions.
    """
    try:
        from app.models.template import Template

        data = request.get_json()
        if not data or "questions" not in data:
            return jsonify({"error": "questions field is required"}), 400

        questions = data["questions"]
        if not isinstance(questions, list):
            return jsonify({"error": "questions must be an array"}), 400

        # Validate each question has required fields
        for q in questions:
            if not all(k in q for k in ["id", "question", "type"]):
                return (
                    jsonify(
                        {"error": "Each question must have id, question, and type"}
                    ),
                    400,
                )

        # Sort questions by order if provided
        questions_sorted = sorted(questions, key=lambda x: x.get("order", 0))

        # Split questions back into templates based on their IDs
        # Common: q_name, q_role
        # Simple: q_project_name, q_grant_type, q_brief_description
        # Complex: q_detailed_description, q_topics, q_urgency, q_other_details

        common_ids = {"q_name", "q_role"}
        simple_ids = {"q_project_name", "q_grant_type", "q_brief_description"}
        complex_ids = {
            "q_detailed_description",
            "q_topics",
            "q_urgency",
            "q_other_details",
        }

        common_questions = []
        simple_questions = []
        complex_questions = []

        for q in questions_sorted:
            # Remove the 'order' field as templates don't use it
            question_data = {
                "id": q["id"],
                "question": q["question"],
                "type": q["type"],
                "options": q.get("options"),
            }

            q_id = q["id"]
            if q_id in common_ids or q_id.startswith("q_kind_of_"):
                common_questions.append(question_data)
            elif q_id in simple_ids:
                simple_questions.append(question_data)
            elif q_id in complex_ids:
                complex_questions.append(question_data)

        # Update each template
        if common_questions:
            Template.upsert_template(current_app.db, "common", common_questions)
        if simple_questions:
            Template.upsert_template(current_app.db, "simple", simple_questions)
        if complex_questions:
            Template.upsert_template(current_app.db, "complex", complex_questions)

        return jsonify({"message": "Form questions updated successfully"}), 200

    except Exception as e:
        current_app.logger.error(f"Error updating form questions: {str(e)}")
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
