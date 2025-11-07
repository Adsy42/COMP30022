"""Tests for template endpoints."""


class TestGetTemplates:
    """Test GET /templates endpoint."""

    def test_get_template_success(self, client, sample_template):
        """Test getting template with valid type."""
        response = client.get("/api/templates?template=common")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) > 0
        assert data[0]["id"] == "q_test"

    def test_get_nonexistent_template(self, client):
        """Test getting template that doesn't exist returns empty array."""
        response = client.get("/api/templates?template=simple")
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_missing_template_parameter(self, client):
        """Test getting template without template parameter."""
        response = client.get("/api/templates")
        assert response.status_code == 400

    def test_invalid_template_type(self, client):
        """Test getting template with invalid type."""
        response = client.get("/api/templates?template=invalid")
        assert response.status_code == 400


class TestSaveTemplate:
    """Test POST /templates/save endpoint."""

    def test_save_template_success(self, client, auth_headers):
        """Test saving template with valid data."""
        questions = [
            {
                "id": "q_new",
                "question": "New question?",
                "type": "single",
                "options": [
                    {"label": "Option 1", "followUp": None},
                    {"label": "Option 2", "followUp": None},
                ],
            }
        ]
        response = client.post(
            "/api/templates/save?template=simple",
            headers=auth_headers,
            json=questions,
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["ok"] is True

    def test_save_template_without_auth(self, client):
        """Test saving template without authentication."""
        questions = [
            {"id": "q_test", "question": "Test?", "type": "freeform", "options": None}
        ]
        response = client.post(
            "/api/templates/save?template=simple", json=questions
        )
        assert response.status_code == 401

    def test_save_template_invalid_type(self, client, auth_headers):
        """Test saving template with invalid type."""
        questions = [
            {"id": "q_test", "question": "Test?", "type": "freeform", "options": None}
        ]
        response = client.post(
            "/api/templates/save?template=invalid",
            headers=auth_headers,
            json=questions,
        )
        assert response.status_code == 400

    def test_save_template_missing_parameter(self, client, auth_headers):
        """Test saving template without template parameter."""
        questions = [
            {"id": "q_test", "question": "Test?", "type": "freeform", "options": None}
        ]
        response = client.post(
            "/api/templates/save", headers=auth_headers, json=questions
        )
        assert response.status_code == 400

    def test_save_template_invalid_json(self, client, auth_headers):
        """Test saving template with invalid JSON structure."""
        response = client.post(
            "/api/templates/save?template=simple",
            headers=auth_headers,
            json="not a list",
        )
        assert response.status_code == 400
