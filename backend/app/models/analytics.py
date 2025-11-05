"""Analytics model for storing form response statistics."""

from typing import Dict, Any, List, Optional
from datetime import datetime
from bson import ObjectId


class Analytics:
    """Model for analytics data including KPIs and question response counts."""

    def __init__(
        self,
        total_queries: int = 0,
        simple_queries: int = 0,
        ai_resolved_queries: int = 0,
        question_analytics: Optional[List[Dict[str, Any]]] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        _id: Optional[ObjectId] = None,
    ):
        """Initialize an Analytics instance."""
        self._id = _id
        self.total_queries = total_queries
        self.simple_queries = simple_queries
        self.ai_resolved_queries = ai_resolved_queries
        self.question_analytics = question_analytics or []
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        """Convert Analytics to dictionary representation."""
        return {
            "kpi": {
                "total_queries": self.total_queries,
                "simple_queries": self.simple_queries,
                "ai_resolved_queries": self.ai_resolved_queries,
            },
            "questions": self.question_analytics,
        }

    def to_db_dict(self) -> Dict[str, Any]:
        """Convert Analytics to database dictionary."""
        doc = {
            "total_queries": self.total_queries,
            "simple_queries": self.simple_queries,
            "ai_resolved_queries": self.ai_resolved_queries,
            "question_analytics": self.question_analytics,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self._id:
            doc["_id"] = self._id
        return doc

    @classmethod
    def from_db(cls, doc: Dict[str, Any]) -> Optional["Analytics"]:
        """Create Analytics from database document."""
        if not doc:
            return None
        return cls(
            _id=doc.get("_id"),
            total_queries=doc.get("total_queries", 0),
            simple_queries=doc.get("simple_queries", 0),
            ai_resolved_queries=doc.get("ai_resolved_queries", 0),
            question_analytics=doc.get("question_analytics", []),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        )

    def save(self, db):
        """Save or update Analytics in database."""
        self.updated_at = datetime.utcnow()
        doc = self.to_db_dict()

        if self._id:
            # Update existing
            db.analytics.update_one({"_id": self._id}, {"$set": doc})
        else:
            # Insert new
            result = db.analytics.insert_one(doc)
            self._id = result.inserted_id

        return self._id

    @staticmethod
    def get_current(db) -> Optional["Analytics"]:
        """
        Get the current analytics data.
        There should only be one analytics document.
        """
        doc = db.analytics.find_one()
        return Analytics.from_db(doc) if doc else None

    @staticmethod
    def initialize(db, analytics_data: Dict[str, Any]):
        """
        Initialize analytics with seed data.
        Replaces existing analytics data.
        """
        # Clear existing
        db.analytics.delete_many({})

        # Create new analytics document
        analytics = Analytics(
            total_queries=analytics_data.get("kpi", {}).get("total_queries", 0),
            simple_queries=analytics_data.get("kpi", {}).get("simple_queries", 0),
            ai_resolved_queries=analytics_data.get("kpi", {}).get(
                "ai_resolved_queries", 0
            ),
            question_analytics=analytics_data.get("questions", []),
        )
        analytics.save(db)
        return analytics


def increment_chat_stats(db, chat_status="completed", is_ai_resolved=False):
    """
    Increment basic analytics counters in MongoDB for monitoring usage patterns.

    Args:
        db: The MongoDB database connection (from current_app.db).
        chat_status (str): The status of the chat, e.g., "completed" or "pending".
        is_ai_resolved (bool): Whether the chat was successfully handled by the AI.
    """
    try:
        analytics = db.analytics

        # Increment total chats count
        analytics.update_one(
            {"metric": "total_chats"}, {"$inc": {"count": 1}}, upsert=True
        )

        # Increment resolved vs unresolved
        if is_ai_resolved:
            analytics.update_one(
                {"metric": "resolved_chats"}, {"$inc": {"count": 1}}, upsert=True
            )
        else:
            analytics.update_one(
                {"metric": "unresolved_chats"}, {"$inc": {"count": 1}}, upsert=True
            )

        # Increment by chat status
        analytics.update_one(
            {"metric": f"chats_{chat_status}"}, {"$inc": {"count": 1}}, upsert=True
        )

        print(f"[Analytics] Updated stats: {chat_status}, resolved={is_ai_resolved}")

    except Exception as e:
        print(f"[Analytics] Failed to increment stats: {e}")
