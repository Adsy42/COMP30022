"""Analytics API endpoints."""
from flask import Blueprint, jsonify, request, current_app, send_file
from ..utils.auth import token_required
from ..utils.helpers import parse_date_range
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill
import io

bp = Blueprint("analytics", __name__, url_prefix="")


@bp.route("/kpis", methods=["GET"])
@token_required
def get_kpis():
    """
    GET /kpis?start_time=...&end_time=...
    Get KPI information for a date range.
    Returns: {
        "total_queries": 100,
        "simple_queries": 70,
        "ai_resolved_queries": 50
    }
    """
    try:
        start_time_str = request.args.get("start_time")
        end_time_str = request.args.get("end_time")

        # Build query filter
        query_filter = {"finalized_at": {"$exists": True}}

        if start_time_str and end_time_str:
            try:
                start_dt, end_dt = parse_date_range(start_time_str, end_time_str)
                query_filter["finalized_at"]["$gte"] = start_dt
                query_filter["finalized_at"]["$lte"] = end_dt
            except ValueError as e:
                return jsonify({"error": str(e)}), 400

        # Get chat collection
        chats = current_app.db["chats"]

        # Calculate KPIs
        total_queries = chats.count_documents(query_filter)

        simple_filter = {**query_filter, "status": "simple"}
        simple_queries = chats.count_documents(simple_filter)

        # AI resolved = simple queries that were not escalated
        ai_resolved_filter = {**simple_filter, "escalated": False}
        ai_resolved_queries = chats.count_documents(ai_resolved_filter)

        return (
            jsonify(
                {
                    "total_queries": total_queries,
                    "simple_queries": simple_queries,
                    "ai_resolved_queries": ai_resolved_queries,
                }
            ),
            200,
        )

    except Exception as e:
        current_app.logger.error(f"Error getting KPIs: {str(e)}")
        return jsonify({"error": "Failed to get KPIs", "message": str(e)}), 500


@bp.route("/analytics/choice", methods=["POST"])
@token_required
def get_choice_analytics():
    """
    POST /analytics/choice
    Get choice question analytics (single + multi).
    Body: {
        "start_time": "01/09/2025",
        "end_time": "01/10/2025",
        "template": "common|simple|complex" (optional)
    }
    Returns: [{
        "question": "What is your role?",
        "type": "single|multi",
        "options": [
            {"label": "Researcher", "count": 42},
            {"label": "Sponsor", "count": 18}
        ]
    }]
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        start_time_str = data.get("start_time")
        end_time_str = data.get("end_time")
        template_filter = data.get("template")

        if not start_time_str or not end_time_str:
            return jsonify({"error": "start_time and end_time are required"}), 400

        try:
            start_dt, end_dt = parse_date_range(start_time_str, end_time_str)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

        # Build query
        query = {"finalized_at": {"$gte": start_dt, "$lte": end_dt, "$exists": True}}

        if template_filter:
            query["template_type"] = template_filter

        # Get templates to map questions
        from ..models.template import Template

        templates = Template.find_all_active(current_app.db)
        question_map = {}  # Map q_id to question details

        for template in templates:
            for question in template.questions:
                q_id = question.get("id")
                q_type = question.get("type")
                q_text = question.get("question")

                if q_type in ["single", "multi"] and q_id:
                    question_map[q_id] = {
                        "question": q_text,
                        "type": q_type,
                        "options": {},
                    }

                    # Initialize option labels
                    if question.get("options"):
                        for opt in question["options"]:
                            label = opt.get("label")
                            if label:
                                question_map[q_id]["options"][label] = 0

        # Aggregate answers
        chats = current_app.db["chats"].find(query)

        for chat in chats:
            # Process both common and template answers
            all_answers = chat.get("common_answers", []) + chat.get(
                "template_answers", []
            )

            for answer in all_answers:
                q_id = answer.get("q_id")
                ans = answer.get("ans")

                if q_id in question_map:
                    q_info = question_map[q_id]
                    q_type = q_info["type"]

                    if q_type == "single" and isinstance(ans, str):
                        # For single choice, ans might be an option ID or label
                        # Try to find matching label
                        if ans in q_info["options"]:
                            q_info["options"][ans] += 1
                        else:
                            # Try to match by option ID (e.g., "opt_researcher")
                            for label in q_info["options"]:
                                if label.lower().replace(" ", "_") in ans.lower():
                                    q_info["options"][label] += 1
                                    break

                    elif q_type == "multi" and isinstance(ans, list):
                        # For multi choice, ans is a list of option IDs or labels
                        for option in ans:
                            if option in q_info["options"]:
                                q_info["options"][option] += 1
                            else:
                                # Try to match by option ID
                                for label in q_info["options"]:
                                    if (
                                        label.lower().replace(" ", "_")
                                        in option.lower()
                                    ):
                                        q_info["options"][label] += 1
                                        break

        # Format response
        result = []
        for q_id, q_data in question_map.items():
            if any(count > 0 for count in q_data["options"].values()):
                result.append(
                    {
                        "question": q_data["question"],
                        "type": q_data["type"],
                        "options": [
                            {"label": label, "count": count}
                            for label, count in q_data["options"].items()
                        ],
                    }
                )

        return jsonify(result), 200

    except Exception as e:
        current_app.logger.error(f"Error getting choice analytics: {str(e)}")
        return (
            jsonify({"error": "Failed to get choice analytics", "message": str(e)}),
            500,
        )


@bp.route("/analytics/choice-export", methods=["GET"])
@token_required
def export_choice_analytics():
    """
    GET /analytics/choice-export?start_time=...&end_time=...&template=...
    Export choice analytics as Excel file.
    Returns: Excel (.xlsx) file
    """
    try:
        start_time_str = request.args.get("start_time")
        end_time_str = request.args.get("end_time")
        template_filter = request.args.get("template")

        if not start_time_str or not end_time_str:
            return jsonify({"error": "start_time and end_time are required"}), 400

        # Get analytics data using the same logic as /analytics/choice
        # For simplicity, we'll make an internal call
        data = {
            "start_time": start_time_str,
            "end_time": end_time_str,
        }
        if template_filter:
            data["template"] = template_filter

        # Re-use the analytics logic
        try:
            start_dt, end_dt = parse_date_range(start_time_str, end_time_str)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

        query = {"finalized_at": {"$gte": start_dt, "$lte": end_dt, "$exists": True}}

        if template_filter:
            query["template_type"] = template_filter

        from ..models.template import Template

        templates = Template.find_all_active(current_app.db)
        question_map = {}

        for template in templates:
            for question in template.questions:
                q_id = question.get("id")
                q_type = question.get("type")
                q_text = question.get("question")

                if q_type in ["single", "multi"] and q_id:
                    question_map[q_id] = {
                        "question": q_text,
                        "type": q_type,
                        "options": {},
                    }

                    if question.get("options"):
                        for opt in question["options"]:
                            label = opt.get("label")
                            if label:
                                question_map[q_id]["options"][label] = 0

        chats = current_app.db["chats"].find(query)

        for chat in chats:
            all_answers = chat.get("common_answers", []) + chat.get(
                "template_answers", []
            )

            for answer in all_answers:
                q_id = answer.get("q_id")
                ans = answer.get("ans")

                if q_id in question_map:
                    q_info = question_map[q_id]
                    q_type = q_info["type"]

                    if q_type == "single" and isinstance(ans, str):
                        if ans in q_info["options"]:
                            q_info["options"][ans] += 1
                        else:
                            for label in q_info["options"]:
                                if label.lower().replace(" ", "_") in ans.lower():
                                    q_info["options"][label] += 1
                                    break

                    elif q_type == "multi" and isinstance(ans, list):
                        for option in ans:
                            if option in q_info["options"]:
                                q_info["options"][option] += 1
                            else:
                                for label in q_info["options"]:
                                    if (
                                        label.lower().replace(" ", "_")
                                        in option.lower()
                                    ):
                                        q_info["options"][label] += 1
                                        break

        # Create Excel workbook
        wb = Workbook()
        ws = wb.active
        ws.title = "Choice Analytics"

        # Header styling
        header_fill = PatternFill(
            start_color="4472C4", end_color="4472C4", fill_type="solid"
        )
        header_font = Font(bold=True, color="FFFFFF")

        # Write headers
        ws["A1"] = "Question"
        ws["B1"] = "Type"
        ws["C1"] = "Option"
        ws["D1"] = "Count"

        for cell in ["A1", "B1", "C1", "D1"]:
            ws[cell].fill = header_fill
            ws[cell].font = header_font

        # Write data
        row = 2
        for q_id, q_data in question_map.items():
            if any(count > 0 for count in q_data["options"].values()):
                first_row = True
                for label, count in q_data["options"].items():
                    if first_row:
                        ws[f"A{row}"] = q_data["question"]
                        ws[f"B{row}"] = q_data["type"]
                        first_row = False
                    ws[f"C{row}"] = label
                    ws[f"D{row}"] = count
                    row += 1

        # Adjust column widths
        ws.column_dimensions["A"].width = 50
        ws.column_dimensions["B"].width = 10
        ws.column_dimensions["C"].width = 30
        ws.column_dimensions["D"].width = 10

        # Save to bytes
        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        return send_file(
            output,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            as_attachment=True,
            download_name=f"choice_analytics_{start_time_str}_{end_time_str}.xlsx",
        )

    except Exception as e:
        current_app.logger.error(f"Error exporting choice analytics: {str(e)}")
        return jsonify({"error": "Failed to export analytics", "message": str(e)}), 500


@bp.route("/analytics/single-choice", methods=["POST"])
@token_required
def get_single_choice_analytics():
    """
    POST /analytics/single-choice (DEPRECATED)
    Legacy endpoint for single-choice analytics.
    Use /analytics/choice instead.
    """
    # Redirect to new endpoint
    return get_choice_analytics()


def increment_chat_stats(db, chat_status="completed", is_ai_resolved=False):
    """
    Increment basic analytics counters in MongoDB for monitoring usage patterns.

    Args:
        db: The MongoDB database connection (from current_app.db).
        chat_status (str): The status of the chat, e.g., "completed" or "pending".
        is_ai_resolved (bool): Whether the chat was successfully handled by the AI.
    """
    try:
        # Access or create the analytics collection
        analytics = db.analytics

        # Increment total chats count
        analytics.update_one(
            {"metric": "total_chats"},
            {"$inc": {"count": 1}},
            upsert=True
        )

        # Increment resolved vs unresolved
        if is_ai_resolved:
            analytics.update_one(
                {"metric": "resolved_chats"},
                {"$inc": {"count": 1}},
                upsert=True
            )
        else:
            analytics.update_one(
                {"metric": "unresolved_chats"},
                {"$inc": {"count": 1}},
                upsert=True
            )

        # Increment by chat status
        analytics.update_one(
            {"metric": f"chats_{chat_status}"},
            {"$inc": {"count": 1}},
            upsert=True
        )

        print(f"[Analytics] Updated stats: {chat_status}, resolved={is_ai_resolved}")

    except Exception as e:
        print(f"[Analytics] Failed to increment stats: {e}")



