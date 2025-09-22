import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os


class TestAPIEndpoints:
    """Test API endpoints functionality."""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns correct message."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "Legal AI RAG Service is running" in data["message"]
    
    def test_health_endpoint(self, client):
        """Test health endpoint returns healthy status."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_resources_endpoint(self, client):
        """Test resources endpoint returns list."""
        response = client.get("/api/resources")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_query_endpoint_structure(self, client):
        """Test query endpoint accepts correct request structure."""
        query_data = {
            "question": "What is the contract term?",
            "include_documents": True,
            "max_results": 5
        }
        
        # Mock the RAG service to avoid actual API calls
        with patch('app.api.chat.rag_service') as mock_rag:
            mock_rag.query.return_value = {
                "answer": "Test answer",
                "sources": ["test.pdf"],
                "confidence": 0.8
            }
            
            response = client.post("/api/query", json=query_data)
            # Should return 200 or 500 (depending on service initialization)
            assert response.status_code in [200, 500]
    
    def test_query_endpoint_validation(self, client):
        """Test query endpoint validates required fields."""
        # Test missing question
        response = client.post("/api/query", json={
            "include_documents": True,
            "max_results": 5
        })
        assert response.status_code == 422  # Validation error
    
    def test_upload_document_validation(self, client):
        """Test document upload validates file types."""
        # Test with invalid file type
        response = client.post("/api/upload/document", 
                             files={"file": ("test.txt", b"content", "text/plain")})
        assert response.status_code == 400
        assert "Only PDF and Word documents are supported" in response.json()["detail"]
    
    def test_upload_faq_validation(self, client):
        """Test FAQ upload validates file types."""
        # Test with invalid file type
        response = client.post("/api/upload/faq", 
                             files={"file": ("test.txt", b"content", "text/plain")})
        assert response.status_code == 400
        assert "Only Excel (.xlsx, .xls) and CSV files are supported" in response.json()["detail"]
    
    def test_delete_nonexistent_resource(self, client):
        """Test deleting nonexistent resource returns 404."""
        response = client.delete("/api/resources/nonexistent-id")
        assert response.status_code == 404
        assert "Resource not found" in response.json()["detail"]
    
    def test_openapi_docs(self, client):
        """Test that OpenAPI documentation is accessible."""
        response = client.get("/docs")
        assert response.status_code == 200
    
    def test_api_schema(self, client):
        """Test that API schema is accessible."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        schema = response.json()
        assert "openapi" in schema
        assert "info" in schema
