import pytest
from app import create_app
from app.models.user import User
from app.models.template import Template
from app.models.chat import Chat


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app("testing")
    app.config["TESTING"] = True

    with app.app_context():
        # Clear test database before each test
        app.db.drop_collection("users")
        app.db.drop_collection("chats")
        app.db.drop_collection("templates")
        app.db.drop_collection("app_config")
        app.db.drop_collection("uploads")

        yield app

        # Cleanup after test
        app.db.drop_collection("users")
        app.db.drop_collection("chats")
        app.db.drop_collection("templates")
        app.db.drop_collection("app_config")
        app.db.drop_collection("uploads")


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


@pytest.fixture
def admin_user(app):
    """Create an admin user for testing."""
    user = User(
        username="testadmin",
        email="test@example.com",
        password_hash=User.hash_password("testpass123"),
        role="admin",
        is_active=True,
    )
    user.save(app.db)
    return user


@pytest.fixture
def auth_token(client, admin_user):
    """Get JWT token for admin user."""
    response = client.post(
        "/api/login", json={"username": "testadmin", "password": "testpass123"}
    )
    data = response.get_json()
    return data["token"]


@pytest.fixture
def auth_headers(auth_token):
    """Get authorization headers with JWT token."""
    return {"Authorization": f"Bearer {auth_token}"}


@pytest.fixture
def sample_template(app):
    """Create a sample template for testing."""
    questions = [
        {
            "id": "q_test",
            "question": "Test question?",
            "type": "freeform",
            "options": None,
        }
    ]
    template = Template.upsert_template(app.db, "common", questions)
    return template


@pytest.fixture
def sample_chat(app):
    """Create a sample chat session for testing."""
    chat = Chat()
    chat.save(app.db)
    return chat
