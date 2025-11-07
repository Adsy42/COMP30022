"""Application configuration model."""

from datetime import datetime


class AppConfig:
    """Application configuration model for storing app settings."""

    COLLECTION = "app_config"

    def __init__(
        self,
        key,
        value,
        description=None,
        created_at=None,
        updated_at=None,
        _id=None,
    ):
        self._id = _id
        self.key = key
        self.value = value
        self.description = description
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "_id": self._id,
            "key": self.key,
            "value": self.value,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data):
        """Create AppConfig instance from dictionary."""
        return cls(
            key=data.get("key"),
            value=data.get("value"),
            description=data.get("description"),
            created_at=data.get("created_at"),
            updated_at=data.get("updated_at"),
            _id=data.get("_id"),
        )

    @classmethod
    def get(cls, db, key, default=None):
        """Get configuration value by key."""
        config_data = db[cls.COLLECTION].find_one({"key": key})
        if config_data:
            return cls.from_dict(config_data).value
        return default

    @classmethod
    def set(cls, db, key, value, description=None):
        """Set configuration value."""
        existing = db[cls.COLLECTION].find_one({"key": key})
        if existing:
            db[cls.COLLECTION].update_one(
                {"key": key},
                {"$set": {"value": value, "updated_at": datetime.utcnow()}},
            )
        else:
            config = cls(key=key, value=value, description=description)
            config.save(db)

    def save(self, db):
        """Save configuration to database."""
        self.updated_at = datetime.utcnow()
        config_dict = {
            "key": self.key,
            "value": self.value,
            "description": self.description,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
        if self._id:
            db[self.COLLECTION].update_one({"_id": self._id}, {"$set": config_dict})
        else:
            result = db[self.COLLECTION].insert_one(config_dict)
            self._id = result.inserted_id
        return self._id
