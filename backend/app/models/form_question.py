"""Form question model for storing dynamic form configurations."""
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId


class FormQuestion:
    """Model for form questions with nested options and follow-ups."""

    def __init__(
        self,
        question_id: str,
        question: str,
        type: str,
        order: int,
        options: Optional[List[Dict[str, Any]]] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        _id: Optional[ObjectId] = None,
    ):
        """Initialize a FormQuestion instance."""
        self._id = _id
        self.question_id = question_id
        self.question = question
        self.type = type  # 'text', 'single', 'multi'
        self.order = order
        self.options = options or []
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        """Convert FormQuestion to dictionary representation."""
        return {
            "id": self.question_id,
            "question": self.question,
            "type": self.type,
            "options": self.options,
            "order": self.order,
        }

    def to_db_dict(self) -> Dict[str, Any]:
        """Convert FormQuestion to database dictionary (includes timestamps)."""
        doc = {
            "question_id": self.question_id,
            "question": self.question,
            "type": self.type,
            "order": self.order,
            "options": self.options,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self._id:
            doc["_id"] = self._id
        return doc

    @classmethod
    def from_db(cls, doc: Dict[str, Any]) -> "FormQuestion":
        """Create FormQuestion from database document."""
        if not doc:
            return None
        return cls(
            _id=doc.get("_id"),
            question_id=doc.get("question_id"),
            question=doc.get("question"),
            type=doc.get("type"),
            order=doc.get("order", 0),
            options=doc.get("options", []),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        )

    def save(self, db):
        """Save or update FormQuestion in database."""
        self.updated_at = datetime.utcnow()
        doc = self.to_db_dict()

        if self._id:
            # Update existing
            db.form_questions.update_one({"_id": self._id}, {"$set": doc})
        else:
            # Insert new
            result = db.form_questions.insert_one(doc)
            self._id = result.inserted_id

        return self._id

    @staticmethod
    def get_all(db) -> List["FormQuestion"]:
        """Get all form questions ordered by their order field."""
        docs = db.form_questions.find().sort("order", 1)
        return [FormQuestion.from_db(doc) for doc in docs]

    @staticmethod
    def get_by_id(db, question_id: str) -> Optional["FormQuestion"]:
        """Get a form question by its question_id."""
        doc = db.form_questions.find_one({"question_id": question_id})
        return FormQuestion.from_db(doc) if doc else None

    @staticmethod
    def delete_all(db):
        """Delete all form questions."""
        return db.form_questions.delete_many({})

    @staticmethod
    def bulk_insert(db, questions: List[Dict[str, Any]]):
        """Bulk insert form questions."""
        if not questions:
            return

        # Clear existing questions
        FormQuestion.delete_all(db)

        # Insert new questions
        docs = []
        for q in questions:
            fq = FormQuestion(
                question_id=q["id"],
                question=q["question"],
                type=q["type"],
                order=q["order"],
                options=q.get("options", []),
            )
            docs.append(fq.to_db_dict())

        if docs:
            db.form_questions.insert_many(docs)

    @staticmethod
    def reorder(db, new_order: List[str]) -> bool:
        """
        Reorder questions based on a list of question IDs.
        Returns True if successful, False otherwise.
        """
        try:
            for idx, question_id in enumerate(new_order):
                db.form_questions.update_one(
                    {"question_id": question_id},
                    {"$set": {"order": idx, "updated_at": datetime.utcnow()}},
                )
            return True
        except Exception:
            return False
