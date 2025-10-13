"""Tests for chat session endpoints."""
import json


class TestCreateChat:
    """Test POST /chats endpoint."""
    
    def test_create_chat_success(self, client):
        """Test creating a new chat session."""
        response = client.post("/chats")
        assert response.status_code == 201
        data = response.get_json()
        assert "chat_id" in data
        assert data["chat_id"].startswith("chat_")


class TestUpsertAnswers:
    """Test POST /chats/{chat_id}/answers endpoint."""
    
    def test_upsert_common_answers(self, client, sample_chat):
        """Test upserting common answers."""
        answers_data = {
            "template": "common",
            "answers": [
                {"q_id": "q_name", "ans": "John Doe"},
                {"q_id": "q_role", "ans": "Researcher"}
            ]
        }
        response = client.post(
            f"/chats/{sample_chat.chat_id}/answers",
            json=answers_data
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True
    
    def test_upsert_simple_answers(self, client, sample_chat):
        """Test upserting simple template answers."""
        answers_data = {
            "template": "simple",
            "answers": [
                {"q_id": "q_project", "ans": "Test Project"}
            ]
        }
        response = client.post(
            f"/chats/{sample_chat.chat_id}/answers",
            json=answers_data
        )
        assert response.status_code == 200
    
    def test_upsert_with_attachments(self, client, sample_chat):
        """Test upserting answers with attachments."""
        answers_data = {
            "template": "complex",
            "answers": [{"q_id": "q_desc", "ans": "Description"}],
            "attachments": ["f_test123", "f_test456"]
        }
        response = client.post(
            f"/chats/{sample_chat.chat_id}/answers",
            json=answers_data
        )
        assert response.status_code == 200
    
    def test_upsert_nonexistent_chat(self, client):
        """Test upserting answers for non-existent chat."""
        answers_data = {
            "template": "common",
            "answers": [{"q_id": "q_test", "ans": "test"}]
        }
        response = client.post(
            "/chats/chat_nonexistent/answers",
            json=answers_data
        )
        assert response.status_code == 404
    
    def test_upsert_missing_template(self, client, sample_chat):
        """Test upserting without template field."""
        response = client.post(
            f"/chats/{sample_chat.chat_id}/answers",
            json={"answers": [{"q_id": "q_test", "ans": "test"}]}
        )
        assert response.status_code == 400
    
    def test_upsert_invalid_template_type(self, client, sample_chat):
        """Test upserting with invalid template type."""
        answers_data = {
            "template": "invalid",
            "answers": [{"q_id": "q_test", "ans": "test"}]
        }
        response = client.post(
            f"/chats/{sample_chat.chat_id}/answers",
            json=answers_data
        )
        assert response.status_code == 400


class TestFinalizeChat:
    """Test POST /chats/{chat_id}/finalize endpoint."""
    
    def test_finalize_chat_success(self, client, sample_chat, app):
        """Test finalizing a chat session."""
        # Add some answers first
        sample_chat.add_answers("common", [{"q_id": "q_name", "ans": "Test"}])
        sample_chat.add_answers("simple", [{"q_id": "q_project", "ans": "Project"}])
        sample_chat.save(app.db)
        
        response = client.post(f"/chats/{sample_chat.chat_id}/finalize")
        assert response.status_code == 200
        data = response.get_json()
        assert "chat_id" in data
        assert "status" in data
        assert data["status"] in ["simple", "complex"]
    
    def test_finalize_nonexistent_chat(self, client):
        """Test finalizing non-existent chat."""
        response = client.post("/chats/chat_nonexistent/finalize")
        assert response.status_code == 404
