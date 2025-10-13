"""Tests for escalation endpoints."""
import json


class TestEscalations:
    """Test POST /escalations endpoint."""
    
    def test_escalate_query(self, client, sample_chat, app):
        """Test escalating a query."""
        # Finalize the chat first
        sample_chat.status = "simple"
        sample_chat.save(app.db)
        
        escalation_data = {
            "chat_id": sample_chat.chat_id,
            "escalate": True,
            "reason": "AI missed important details"
        }
        response = client.post("/escalations", json=escalation_data)
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True
    
    def test_complete_query_without_escalation(self, client, sample_chat, app):
        """Test completing a query without escalation."""
        sample_chat.status = "simple"
        sample_chat.save(app.db)
        
        escalation_data = {
            "chat_id": sample_chat.chat_id,
            "escalate": False
        }
        response = client.post("/escalations", json=escalation_data)
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True
    
    def test_escalate_nonexistent_chat(self, client):
        """Test escalating non-existent chat."""
        escalation_data = {
            "chat_id": "chat_nonexistent",
            "escalate": True
        }
        response = client.post("/escalations", json=escalation_data)
        assert response.status_code == 404
    
    def test_escalate_missing_chat_id(self, client):
        """Test escalating without chat_id."""
        escalation_data = {"escalate": True}
        response = client.post("/escalations", json=escalation_data)
        assert response.status_code == 400
    
    def test_escalate_missing_escalate_field(self, client, sample_chat):
        """Test escalating without escalate field."""
        escalation_data = {"chat_id": sample_chat.chat_id}
        response = client.post("/escalations", json=escalation_data)
        assert response.status_code == 400
