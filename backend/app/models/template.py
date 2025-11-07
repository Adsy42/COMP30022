"""Template model for managing form templates."""

from datetime import datetime


class Template:
    """Form template model."""

    COLLECTION = "templates"

    def __init__(
        self,
        template_type,  # 'common', 'simple', or 'complex'
        questions,
        version=1,
        is_active=True,
        created_at=None,
        updated_at=None,
        _id=None,
    ):
        self._id = _id
        self.template_type = template_type
        self.questions = questions
        self.version = version
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "_id": self._id,
            "template_type": self.template_type,
            "questions": self.questions,
            "version": self.version,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data):
        """Create Template instance from dictionary."""
        return cls(
            template_type=data.get("template_type"),
            questions=data.get("questions", []),
            version=data.get("version", 1),
            is_active=data.get("is_active", True),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            _id=data.get("_id"),
        )

    @classmethod
    def find_by_type(cls, db, template_type):
        """Find active template by type."""
        template_data = db[cls.COLLECTION].find_one(
            {"template_type": template_type, "is_active": True}
        )
        if template_data:
            return cls.from_dict(template_data)
        return None

    @classmethod
    def find_all_active(cls, db):
        """Find all active templates."""
        templates = db[cls.COLLECTION].find({"is_active": True})
        return [cls.from_dict(t) for t in templates]

    def save(self, db):
        """Save template to database."""
        self.updated_at = datetime.utcnow()
        template_dict = {
            "template_type": self.template_type,
            "questions": self.questions,
            "version": self.version,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self._id:
            db[self.COLLECTION].update_one({"_id": self._id}, {"$set": template_dict})
        else:
            result = db[self.COLLECTION].insert_one(template_dict)
            self._id = result.inserted_id
        return self._id

    @classmethod
    def upsert_template(cls, db, template_type, questions):
        """Create or update template by type."""
        # Assign IDs to questions that don't have one
        for question in questions:
            if not question.get("id"):
                # Generate a simple ID based on the question text
                question["id"] = "q_" + question.get("question", "")[
                    :20
                ].lower().replace(" ", "_").replace("?", "")

        existing = cls.find_by_type(db, template_type)
        if existing:
            existing.questions = questions
            existing.version += 1
            existing.save(db)
            return existing
        else:
            new_template = cls(template_type=template_type, questions=questions)
            new_template.save(db)
            return new_template
