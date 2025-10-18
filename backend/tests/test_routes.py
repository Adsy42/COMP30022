"""Tests for main routes."""
import json


def test_index_endpoint(client):
    """Test the index endpoint returns correct message."""
    response = client.get("/")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "message" in data


def test_health_endpoint(client):
    """Test the health endpoint returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "healthy"


def test_nonexistent_endpoint(client):
    """Test that nonexistent endpoints return 404."""
    response = client.get("/nonexistent")
    assert response.status_code == 404
