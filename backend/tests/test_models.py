"""Tests for database models."""
import pytest
from app.models.user import User
from app.models.chat import Chat
from app.models.template import Template
from app.models.config import AppConfig


class TestUserModel:
    """Test User model."""
    
    def test_create_user(self, app):
        """Test creating a user."""
        user = User(
            username="testuser",
            email="test@example.com",
            password_hash=User.hash_password("password123")
        )
        user.save(app.db)
        assert user._id is not None
    
    def test_hash_password(self):
        """Test password hashing."""
        password = "mypassword123"
        hashed = User.hash_password(password)
        assert hashed != password
        # Modern Werkzeug uses scrypt instead of pbkdf2
        assert hashed.startswith("scrypt:")
    
    def test_check_password(self):
        """Test password verification."""
        password = "mypassword123"
        user = User(
            username="test",
            email="test@example.com",
            password_hash=User.hash_password(password)
        )
        assert user.check_password(password) is True
        assert user.check_password("wrongpassword") is False
    
    def test_find_by_username(self, app, admin_user):
        """Test finding user by username."""
        found_user = User.find_by_username(app.db, "testadmin")
        assert found_user is not None
        assert found_user.username == "testadmin"
    
    def test_find_by_email(self, app, admin_user):
        """Test finding user by email."""
        found_user = User.find_by_email(app.db, "test@example.com")
        assert found_user is not None
        assert found_user.email == "test@example.com"
    
    def test_user_to_dict(self, admin_user):
        """Test converting user to dictionary."""
        user_dict = admin_user.to_dict()
        assert "username" in user_dict
        assert "email" in user_dict
        assert "password_hash" not in user_dict  # Should not expose password


class TestChatModel:
    """Test Chat model."""
    
    def test_create_chat(self, app):
        """Test creating a chat session."""
        chat = Chat()
        assert chat.chat_id.startswith("chat_")
        assert chat.status == "pending"
        assert chat.common_answers == []
        assert chat.template_answers == []
    
    def test_save_chat(self, app):
        """Test saving a chat to database."""
        chat = Chat()
        chat.save(app.db)
        assert chat._id is not None
    
    def test_find_by_chat_id(self, app, sample_chat):
        """Test finding chat by chat_id."""
        found_chat = Chat.find_by_chat_id(app.db, sample_chat.chat_id)
        assert found_chat is not None
        assert found_chat.chat_id == sample_chat.chat_id
    
    def test_add_common_answers(self, app):
        """Test adding common answers."""
        chat = Chat()
        chat.add_answers("common", [
            {"q_id": "q_name", "ans": "John"},
            {"q_id": "q_email", "ans": "john@example.com"}
        ])
        assert len(chat.common_answers) == 2
        assert chat.common_answers[0]["q_id"] == "q_name"
    
    def test_add_template_answers(self, app):
        """Test adding template answers."""
        chat = Chat()
        chat.add_answers("simple", [
            {"q_id": "q_project", "ans": "Project X"}
        ])
        assert chat.template_type == "simple"
        assert len(chat.template_answers) == 1
    
    def test_add_attachments(self, app):
        """Test adding attachments to chat."""
        chat = Chat()
        chat.add_answers("common", [], attachments=["f_123", "f_456"])
        assert len(chat.attachments) == 2
        assert "f_123" in chat.attachments
    
    def test_upsert_answers(self, app):
        """Test upserting answers (update existing)."""
        chat = Chat()
        chat.add_answers("common", [{"q_id": "q_name", "ans": "John"}])
        chat.add_answers("common", [{"q_id": "q_name", "ans": "Jane"}])
        assert len(chat.common_answers) == 1
        assert chat.common_answers[0]["ans"] == "Jane"


class TestTemplateModel:
    """Test Template model."""
    
    def test_create_template(self, app):
        """Test creating a template."""
        questions = [
            {"id": "q1", "question": "Question 1?", "type": "freeform", "options": None}
        ]
        template = Template(template_type="test", questions=questions)
        template.save(app.db)
        assert template._id is not None
    
    def test_find_by_type(self, app, sample_template):
        """Test finding template by type."""
        found = Template.find_by_type(app.db, "common")
        assert found is not None
        assert found.template_type == "common"
    
    def test_find_all_active(self, app, sample_template):
        """Test finding all active templates."""
        templates = Template.find_all_active(app.db)
        assert len(templates) > 0
        assert all(t.is_active for t in templates)
    
    def test_upsert_template_new(self, app):
        """Test upserting a new template."""
        questions = [{"id": "q_new", "question": "New?", "type": "single", "options": []}]
        template = Template.upsert_template(app.db, "new_type", questions)
        assert template.template_type == "new_type"
        assert template.version == 1
    
    def test_upsert_template_existing(self, app, sample_template):
        """Test upserting an existing template increments version."""
        new_questions = [{"id": "q_updated", "question": "Updated?", "type": "freeform", "options": None}]
        template = Template.upsert_template(app.db, "common", new_questions)
        assert template.version == 2


class TestAppConfigModel:
    """Test AppConfig model."""
    
    def test_set_config(self, app):
        """Test setting a configuration value."""
        AppConfig.set(app.db, "test_key", "test_value")
        value = AppConfig.get(app.db, "test_key")
        assert value == "test_value"
    
    def test_get_nonexistent_config(self, app):
        """Test getting non-existent config returns default."""
        value = AppConfig.get(app.db, "nonexistent", default="default_value")
        assert value == "default_value"
    
    def test_update_config(self, app):
        """Test updating an existing configuration."""
        AppConfig.set(app.db, "update_test", "value1")
        AppConfig.set(app.db, "update_test", "value2")
        value = AppConfig.get(app.db, "update_test")
        assert value == "value2"
