import json


def test_index_endpoint(client):
    """Test the index endpoint returns correct message."""
    response = client.get("/")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["message"] == "Backend API is running"


def test_health_endpoint(client):
    """Test the health endpoint returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["status"] == "healthy"


def test_example_endpoint(client):
    """Test the example API endpoint."""
    response = client.get("/api/example")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "message" in data
    assert "example endpoint" in data["message"].lower()


def test_nonexistent_endpoint(client):
    """Test that nonexistent endpoints return 404."""
    response = client.get("/nonexistent")
    assert response.status_code == 404
