"""API endpoints for form questions configuration."""

from flask import Blueprint, jsonify, request, current_app
from app.models.form_question import FormQuestion
from app.utils.auth import admin_required

bp = Blueprint("form_questions", __name__, url_prefix="/api/form-questions")


@bp.route("", methods=["GET"])
def get_form_questions():
    """Get all form questions with proper ordering."""
    try:
        from app.models.template import Template

        # Fetch all templates
        common = Template.find_by_type(current_app.db, "common")
        simple = Template.find_by_type(current_app.db, "simple")
        complex_template = Template.find_by_type(current_app.db, "complex")

        # Combine all questions
        all_questions = []
        
        if common:
            all_questions.extend(common.questions)
        if simple:
            all_questions.extend(simple.questions)
        if complex_template:
            all_questions.extend(complex_template.questions)

        # Sort by global_order if it exists, otherwise maintain current order
        all_questions.sort(key=lambda q: q.get('global_order', 999))

        # Add order field for response
        for i, q in enumerate(all_questions):
            q['order'] = i

        return jsonify({"data": all_questions}), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching form questions: {str(e)}")
        return jsonify({"error": str(e)}), 500

#still in development 

# @bp.route("", methods=["POST"])
# @admin_required
# def create_or_update_questions():
#     """
#     Create or update form questions (bulk operation).
#     Admin only.

#     This now saves to templates collection instead of form_questions.
#     """
#     try:
#         from app.models.template import Template

#         data = request.get_json()
#         if not data or "questions" not in data:
#             return jsonify({"error": "questions field is required"}), 400

#         questions = data["questions"]
#         if not isinstance(questions, list):
#             return jsonify({"error": "questions must be an array"}), 400

#         # Validate each question has required fields
#         for q in questions:
#             if not all(k in q for k in ["id", "question", "type"]):
#                 return (
#                     jsonify(
#                         {"error": "Each question must have id, question, and type"}
#                     ),
#                     400,
#                 )

#         # Sort questions by order if provided
#         questions_sorted = sorted(questions, key=lambda x: x.get("order", 0))

#         # Split questions back into templates based on their IDs
#         # Common: q_name, q_role
#         # Simple: q_project_name, q_grant_type, q_brief_description
#         # Complex: q_detailed_description, q_topics, q_urgency, q_other_details

#         common_ids = {"q_name", "q_role"}
#         simple_ids = {"q_project_name", "q_grant_type", "q_brief_description"}
#         complex_ids = {
#             "q_detailed_description",
#             "q_topics",
#             "q_urgency",
#             "q_other_details",
#         }

#         common_questions = []
#         simple_questions = []
#         complex_questions = []

#         for q in questions_sorted:
#             # Remove the 'order' field as templates don't use it
#             question_data = {
#                 "id": q["id"],
#                 "question": q["question"],
#                 "type": q["type"],
#                 "options": q.get("options"),
#             }

#             q_id = q["id"]
#             if q_id in common_ids or q_id.startswith("q_kind_of_"):
#                 common_questions.append(question_data)
#             elif q_id in simple_ids:
#                 simple_questions.append(question_data)
#             elif q_id in complex_ids:
#                 complex_questions.append(question_data)

#         # Update each template
#         if common_questions:
#             Template.upsert_template(current_app.db, "common", common_questions)
#         if simple_questions:
#             Template.upsert_template(current_app.db, "simple", simple_questions)
#         if complex_questions:
#             Template.upsert_template(current_app.db, "complex", complex_questions)

#         return jsonify({"message": "Form questions updated successfully"}), 200

#     except Exception as e:
#         current_app.logger.error(f"Error updating form questions: {str(e)}")
#         return jsonify({"error": str(e)}), 500


@bp.route("/reorder", methods=["POST"])
@admin_required
def reorder_questions():
    """
    Reorder form questions within their template.
    
    Request body:
    {
        "template": "common",  // which template to reorder
        "order": ["q_role", "q_name"]  // new order of question IDs
    }
    """
    try:
        from app.models.template import Template
        
        data = request.get_json()
        if not data or "order" not in data or "template" not in data:
            return jsonify({"error": "template and order fields are required"}), 400

        template_type = data["template"]
        new_order = data["order"]
        
        if template_type not in ["common", "simple", "complex"]:
            return jsonify({"error": "Invalid template type"}), 400
            
        if not isinstance(new_order, list):
            return jsonify({"error": "order must be an array"}), 400

        # Get the template
        template = Template.find_by_type(current_app.db, template_type)
        if not template:
            return jsonify({"error": f"Template {template_type} not found"}), 404

        # Create a map of questions by ID
        question_map = {q['id']: q for q in template.questions}

        # Reorder based on new_order
        reordered_questions = []
        for q_id in new_order:
            if q_id in question_map:
                # Remove global_order if it exists
                question = question_map[q_id].copy()
                question.pop('global_order', None)
                reordered_questions.append(question)

        # Update the template
        Template.upsert_template(current_app.db, template_type, reordered_questions)

        return jsonify({"message": f"{template_type} questions reordered successfully"}), 200

    except Exception as e:
        current_app.logger.error(f"Error reordering questions: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# @bp.route("/add", methods=["POST"])
# @admin_required
# def add_question():
#     """
#     Add a new question to a specific template.
    
#     Request body:
#     {
#         "template": "common",
#         "question": {
#             "id": "q_new_question",
#             "question": "What is your new question?",
#             "type": "text",
#             "options": []  // optional
#         },
#         "position": 0  // optional - where to insert (default: end)
#     }
#     """
#     try:
#         from app.models.template import Template
        
#         data = request.get_json()
#         if not data or "template" not in data or "question" not in data:
#             return jsonify({"error": "template and question fields are required"}), 400

#         template_type = data["template"]
#         new_question = data["question"]
#         position = data.get("position")  # None means append to end
        
#         if template_type not in ["common", "simple", "complex"]:
#             return jsonify({"error": "Invalid template type"}), 400
        
#         # Validate question structure
#         if not all(k in new_question for k in ["id", "question", "type"]):
#             return jsonify({"error": "Question must have id, question, and type fields"}), 400

#         # Get the template
#         template = Template.find_by_type(current_app.db, template_type)
#         if not template:
#             # Create new template if it doesn't exist
#             questions = [new_question]
#         else:
#             # Check if question ID already exists
#             if any(q['id'] == new_question['id'] for q in template.questions):
#                 return jsonify({"error": f"Question with id '{new_question['id']}' already exists"}), 400
            
#             questions = list(template.questions)
            
#             # Insert at position or append
#             if position is not None and 0 <= position <= len(questions):
#                 questions.insert(position, new_question)
#             else:
#                 questions.append(new_question)

#         # Update template
#         Template.upsert_template(current_app.db, template_type, questions)

#         return jsonify({
#             "message": f"Question added to {template_type} template",
#             "question_id": new_question['id']
#         }), 201

#     except Exception as e:
#         current_app.logger.error(f"Error adding question: {str(e)}")
#         return jsonify({"error": str(e)}), 500


# @bp.route("/remove", methods=["POST"])
# @admin_required
# def remove_question():
#     """
#     Remove a question from a specific template.
    
#     Request body:
#     {
#         "template": "common",
#         "question_id": "q_name"
#     }
#     """
#     try:
#         from app.models.template import Template
        
#         data = request.get_json()
#         if not data or "template" not in data or "question_id" not in data:
#             return jsonify({"error": "template and question_id fields are required"}), 400

#         template_type = data["template"]
#         question_id = data["question_id"]
        
#         if template_type not in ["common", "simple", "complex"]:
#             return jsonify({"error": "Invalid template type"}), 400

#         # Get the template
#         template = Template.find_by_type(current_app.db, template_type)
#         if not template:
#             return jsonify({"error": f"Template {template_type} not found"}), 404

#         # Check if question exists
#         if not any(q['id'] == question_id for q in template.questions):
#             return jsonify({"error": f"Question '{question_id}' not found in {template_type} template"}), 404

#         # Remove the question
#         questions = [q for q in template.questions if q['id'] != question_id]

#         # Update template
#         Template.upsert_template(current_app.db, template_type, questions)

#         return jsonify({
#             "message": f"Question '{question_id}' removed from {template_type} template"
#         }), 200

#     except Exception as e:
#         current_app.logger.error(f"Error removing question: {str(e)}")
#         return jsonify({"error": str(e)}), 500