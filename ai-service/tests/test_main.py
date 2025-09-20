def test_root_endpoint(client):
    """Test the root endpoint returns correct message."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "AI Service is running" in data["message"]


def test_health_endpoint(client):
    """Test the health endpoint returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_example_endpoint(client):
    """Test the example endpoint."""
    response = client.get("/example")
    assert response.status_code == 200
    data = response.json()
    assert "example endpoint" in data["message"].lower()


def test_openapi_docs(client):
    """Test that OpenAPI docs are accessible."""
    response = client.get("/docs")
    assert response.status_code == 200


def test_nonexistent_endpoint(client):
    """Test that nonexistent endpoints return 404."""
    response = client.get("/nonexistent")
    assert response.status_code == 404
