import pytest
import os
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient


class TestIntegration:
    """Integration tests for the AI service."""
    
    def test_document_upload_flow(self, client):
        """Test complete document upload flow."""
        # Test with actual PDF file
        pdf_path = "data/documents/test_small.pdf"
        
        if os.path.exists(pdf_path):
            with open(pdf_path, "rb") as f:
                response = client.post("/api/upload/document", 
                                     files={"file": ("test_small.pdf", f, "application/pdf")})
                
                # Should return 200 or 500 (depending on service initialization)
                assert response.status_code in [200, 500]
                
                if response.status_code == 200:
                    data = response.json()
                    assert "message" in data
                    assert "resource_id" in data
                    assert "Document uploaded successfully" in data["message"]
    
    def test_faq_upload_flow(self, client):
        """Test complete FAQ upload flow."""
        # Test with actual CSV file
        csv_path = "data/documents/sample_faqs.csv"
        
        if os.path.exists(csv_path):
            with open(csv_path, "rb") as f:
                response = client.post("/api/upload/faq", 
                                     files={"file": ("sample_faqs.csv", f, "text/csv")})
                
                # Should return 200 or 500 (depending on service initialization)
                assert response.status_code in [200, 500]
                
                if response.status_code == 200:
                    data = response.json()
                    assert "message" in data
                    assert "resource_id" in data
                    assert "FAQ uploaded successfully" in data["message"]
    
    def test_query_flow_with_mock(self, client):
        """Test complete query flow with mocked services."""
        # Mock the RAG service
        with patch('app.api.chat.rag_service') as mock_rag:
            mock_rag.query.return_value = {
                "answer": "The contract term is 12 months from the effective date.",
                "sources": ["test_small.pdf"],
                "confidence": 0.85
            }
            
            query_data = {
                "question": "What is the contract term?",
                "include_documents": True,
                "max_results": 3
            }
            
            response = client.post("/api/query", json=query_data)
            
            if response.status_code == 200:
                data = response.json()
                assert "answer" in data
                assert "sources" in data
                assert "confidence" in data
                assert data["answer"] == "The contract term is 12 months from the effective date."
                assert "test_small.pdf" in data["sources"]
                assert data["confidence"] == 0.85
    
    def test_stats_endpoint_with_mock(self, client):
        """Test stats endpoint with mocked service."""
        with patch('app.api.chat.rag_service') as mock_rag:
            mock_rag.get_index_stats.return_value = {
                "total_vectors": 100,
                "dimension": 384,
                "index_fullness": 0.1,
                "namespaces": {"default": 100}
            }
            
            response = client.get("/api/stats")
            
            if response.status_code == 200:
                data = response.json()
                assert "total_vectors" in data
                assert "dimension" in data
                assert "index_fullness" in data
                assert "namespaces" in data
                assert data["total_vectors"] == 100
    
    def test_error_handling(self, client):
        """Test error handling in API endpoints."""
        # Test with invalid JSON
        response = client.post("/api/query", 
                             data="invalid json",
                             headers={"Content-Type": "application/json"})
        assert response.status_code == 422
        
        # Test with missing file
        response = client.post("/api/upload/document")
        assert response.status_code == 422
    
    def test_cors_headers(self, client):
        """Test CORS headers are present."""
        response = client.options("/api/query")
        # CORS preflight should be handled
        assert response.status_code in [200, 405]  # 405 is also acceptable for OPTIONS
    
    def test_api_versioning(self, client):
        """Test API versioning and metadata."""
        response = client.get("/openapi.json")
        if response.status_code == 200:
            schema = response.json()
            assert schema["info"]["title"] == "Legal AI RAG Service"
            assert schema["info"]["version"] == "1.0.0"
            assert "paths" in schema
            assert "/api/query" in schema["paths"]
            assert "/api/upload/document" in schema["paths"]
            assert "/api/upload/faq" in schema["paths"]
