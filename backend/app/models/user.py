"""User model for authentication and authorization."""

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User:
    """User model for admin authentication."""

    COLLECTION = "users"

    def __init__(
        self,
        username,
        email,
        password_hash=None,
        role="admin",
        created_at=None,
        is_active=True,
        _id=None,
    ):
        self._id = _id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.created_at = created_at or datetime.utcnow()
        self.is_active = is_active

    @staticmethod
    def hash_password(password):
        """Generate password hash."""
        return generate_password_hash(password)

    def check_password(self, password):
        """Check if provided password matches hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "_id": self._id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at,
            "is_active": self.is_active,
        }

    @classmethod
    def from_dict(cls, data):
        """Create User instance from dictionary."""
        return cls(
            username=data.get("username"),
            email=data.get("email"),
            password_hash=data.get("password_hash"),
            role=data.get("role", "admin"),
            created_at=data.get("created_at"),
            is_active=data.get("is_active", True),
            _id=data.get("_id"),
        )

    @classmethod
    def find_by_username(cls, db, username):
        """Find user by username."""
        user_data = db[cls.COLLECTION].find_one({"username": username})
        if user_data:
            return cls.from_dict(user_data)
        return None

    @classmethod
    def find_by_email(cls, db, email):
        """Find user by email."""
        user_data = db[cls.COLLECTION].find_one({"email": email})
        if user_data:
            return cls.from_dict(user_data)
        return None

    def save(self, db):
        """Save user to database."""
        user_dict = {
            "username": self.username,
            "email": self.email,
            "password_hash": self.password_hash,
            "role": self.role,
            "created_at": self.created_at,
            "is_active": self.is_active,
        }
        if self._id:
            db[self.COLLECTION].update_one({"_id": self._id}, {"$set": user_dict})
        else:
            result = db[self.COLLECTION].insert_one(user_dict)
            self._id = result.inserted_id
        return self._id
