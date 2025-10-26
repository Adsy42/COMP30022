"""API endpoints for analytics dashboard with mock data support."""

from flask import Blueprint, jsonify, current_app

bp = Blueprint("analytics_dashboard", __name__, url_prefix="/api/analytics")


@bp.route("", methods=["GET"])
def get_analytics_dashboard():
    """
    Get analytics dashboard data including KPIs and question analytics.

    Returns:
        200: Analytics data
        {
            "kpi": {
                "total_queries": 234,
                "simple_queries": 187,
                "ai_resolved_queries": 156
            },
            "questions": [
                {
                    "question": "Grant Team",
                    "type": "single",
                    "options": [
                        {"label": "Health and Medical", "count": 98},
                        ...
                    ]
                },
                ...
            ]
        }
    """
    try:
        from app.models.analytics import Analytics

        analytics = Analytics.get_current(current_app.db)

        if not analytics:
            # Return empty data if no analytics exist
            return (
                jsonify(
                    {
                        "kpi": {
                            "total_queries": 0,
                            "simple_queries": 0,
                            "ai_resolved_queries": 0,
                        },
                        "questions": [],
                    }
                ),
                200,
            )

        return jsonify(analytics.to_dict()), 200

    except Exception as e:
        current_app.logger.error(f"Error getting analytics: {str(e)}")
        return jsonify({"error": str(e)}), 500
