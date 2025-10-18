"""Tests for config endpoints."""


class TestEmailRecipientConfig:
    """Test PUT /config/email-recipient endpoint."""

    def test_update_email_recipient(self, client, auth_headers):
        """Test updating escalation email recipient."""
        config_data = {"email_address": "newrecipient@example.com"}
        response = client.put(
            "/config/email-recipient", headers=auth_headers, json=config_data
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data is True

    def test_update_email_invalid_format(self, client, auth_headers):
        """Test updating with invalid email format."""
        config_data = {"email_address": "not-an-email"}
        response = client.put(
            "/config/email-recipient", headers=auth_headers, json=config_data
        )
        assert response.status_code == 422

    def test_update_email_missing_field(self, client, auth_headers):
        """Test updating without email_address field."""
        response = client.put("/config/email-recipient", headers=auth_headers, json={})
        assert response.status_code == 400

    def test_update_email_without_auth(self, client):
        """Test updating without authentication."""
        config_data = {"email_address": "test@example.com"}
        response = client.put("/config/email-recipient", json=config_data)
        assert response.status_code == 401
