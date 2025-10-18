"""Chat model for managing chat sessions."""
from datetime import datetime
import uuid


class Chat:
    """Chat session model."""

    COLLECTION = "chats"

    def __init__(
        self,
        chat_id=None,
        common_answers=None,
        template_type=None,  # 'simple' or 'complex'
        template_answers=None,
        attachments=None,
        status="pending",  # 'pending', 'simple', 'complex'
        ai_response=None,
        escalated=False,
        escalation_reason=None,
        created_at=None,
        finalized_at=None,
        _id=None,
    ):
        self._id = _id
        self.chat_id = chat_id or f"chat_{uuid.uuid4().hex[:8]}"
        self.common_answers = common_answers or []
        self.template_type = template_type
        self.template_answers = template_answers or []
        self.attachments = attachments or []
        self.status = status
        self.ai_response = ai_response
        self.escalated = escalated
        self.escalation_reason = escalation_reason
        self.created_at = created_at or datetime.utcnow()
        self.finalized_at = finalized_at

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "_id": self._id,
            "chat_id": self.chat_id,
            "common_answers": self.common_answers,
            "template_type": self.template_type,
            "template_answers": self.template_answers,
            "attachments": self.attachments,
            "status": self.status,
            "ai_response": self.ai_response,
            "escalated": self.escalated,
            "escalation_reason": self.escalation_reason,
            "created_at": self.created_at,
            "finalized_at": self.finalized_at,
        }

    @classmethod
    def from_dict(cls, data):
        """Create Chat instance from dictionary."""
        return cls(
            chat_id=data.get("chat_id"),
            common_answers=data.get("common_answers", []),
            template_type=data.get("template_type"),
            template_answers=data.get("template_answers", []),
            attachments=data.get("attachments", []),
            status=data.get("status", "pending"),
            ai_response=data.get("ai_response"),
            escalated=data.get("escalated", False),
            escalation_reason=data.get("escalation_reason"),
            created_at=data.get("created_at"),
            finalized_at=data.get("finalized_at"),
            _id=data.get("_id"),
        )

    @classmethod
    def find_by_chat_id(cls, db, chat_id):
        """Find chat by chat_id."""
        chat_data = db[cls.COLLECTION].find_one({"chat_id": chat_id})
        if chat_data:
            return cls.from_dict(chat_data)
        return None

    def save(self, db):
        """Save chat to database."""
        chat_dict = {
            "chat_id": self.chat_id,
            "common_answers": self.common_answers,
            "template_type": self.template_type,
            "template_answers": self.template_answers,
            "attachments": self.attachments,
            "status": self.status,
            "ai_response": self.ai_response,
            "escalated": self.escalated,
            "escalation_reason": self.escalation_reason,
            "created_at": self.created_at,
            "finalized_at": self.finalized_at,
        }
        if self._id:
            db[self.COLLECTION].update_one({"_id": self._id}, {"$set": chat_dict})
        else:
            result = db[self.COLLECTION].insert_one(chat_dict)
            self._id = result.inserted_id
        return self._id

    def add_answers(self, template, answers, attachments=None):
        """Add or update answers for a template."""
        if template == "common":
            # Upsert common answers
            for answer in answers:
                existing = next(
                    (a for a in self.common_answers if a["q_id"] == answer["q_id"]),
                    None,
                )
                if existing:
                    existing["ans"] = answer["ans"]
                else:
                    self.common_answers.append(answer)
        else:
            # Set template type and answers
            self.template_type = template
            # Upsert template answers
            for answer in answers:
                existing = next(
                    (a for a in self.template_answers if a["q_id"] == answer["q_id"]),
                    None,
                )
                if existing:
                    existing["ans"] = answer["ans"]
                else:
                    self.template_answers.append(answer)

        # Add attachments if provided
        if attachments:
            for att_id in attachments:
                if att_id not in self.attachments:
                    self.attachments.append(att_id)
