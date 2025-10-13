"""Tests for authentication endpoints."""
import json


class TestLogin:
    """Test admin login endpoint."""
    
    def test_successful_login(self, client, admin_user):
        """Test successful login with valid credentials."""
        response = client.post(
            "/login",
            json={"username": "testadmin", "password": "testpass123"}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
        assert "token" in data
        assert data["token"] is not None
    
    def test_invalid_username(self, client, admin_user):
        """Test login with invalid username."""
        response = client.post(
            "/login",
            json={"username": "wronguser", "password": "testpass123"}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is False
        assert data["token"] is None
    
    def test_invalid_password(self, client, admin_user):
        """Test login with invalid password."""
        response = client.post(
            "/login",
            json={"username": "testadmin", "password": "wrongpass"}
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is False
        assert data["token"] is None
    
    def test_missing_username(self, client):
        """Test login without username."""
        response = client.post(
            "/login",
            json={"password": "testpass123"}
        )
        assert response.status_code == 400
    
    def test_missing_password(self, client):
        """Test login without password."""
        response = client.post(
            "/login",
            json={"username": "testadmin"}
        )
        assert response.status_code == 400
    
    def test_empty_request_body(self, client):
        """Test login with empty request body."""
        response = client.post("/login", json={})
        assert response.status_code == 400


class TestTokenRequired:
    """Test JWT token authentication."""
    
    def test_protected_endpoint_without_token(self, client):
        """Test accessing protected endpoint without token."""
        response = client.get("/kpis")
        assert response.status_code == 401
    
    def test_protected_endpoint_with_invalid_token(self, client):
        """Test accessing protected endpoint with invalid token."""
        response = client.get(
            "/kpis",
            headers={"Authorization": "Bearer invalid_token"}
        )
        assert response.status_code == 422  # JWT decode error
    
    def test_protected_endpoint_with_valid_token(self, client, auth_headers):
        """Test accessing protected endpoint with valid token."""
        response = client.get("/kpis", headers=auth_headers)
        # Should not return 401/422 (might return 200 or 400 for missing params)
        assert response.status_code != 401
        assert response.status_code != 422
