"""Template API endpoints."""
from flask import Blueprint, jsonify, request, current_app
from ..models.template import Template
from ..utils.auth import token_required

bp = Blueprint("templates", __name__, url_prefix="")


@bp.route("/templates", methods=["GET"])
def get_templates():
    """
    GET /templates?template=<type>
    Fetch questions by template type.
    """
    template_type = request.args.get("template")

    if not template_type:
        return jsonify({"error": "Template parameter is required"}), 400

    if template_type not in ["simple", "complex", "common"]:
        return jsonify({"error": "Invalid template type"}), 400

    template = Template.find_by_type(current_app.db, template_type)

    if not template:
        # Return empty array if template doesn't exist yet
        return jsonify([]), 200

    return jsonify(template.questions), 200


@bp.route("/templates/save", methods=["POST"])
@token_required
def save_template():
    """
    POST /templates/save?template=<type>
    Save template questions (admin only).
    Requires JWT authentication.
    """
    template_type = request.args.get("template")

    if not template_type:
        return jsonify({"error": "Template parameter is required"}), 400

    if template_type not in ["simple", "complex", "common"]:
        return jsonify({"error": "Invalid template type"}), 400

    try:
        questions = request.get_json()

        if not isinstance(questions, list):
            return jsonify({"error": "Request body must be an array of questions"}), 400

        # Upsert template
        Template.upsert_template(current_app.db, template_type, questions)

        return jsonify({"ok": True}), 200

    except Exception as e:
        current_app.logger.error(f"Error saving template: {str(e)}")
        return jsonify({"error": "Failed to save template", "message": str(e)}), 500
