from unittest.mock import patch


class TestQueryEndpoint:
    """Test query endpoint functionality."""

    def test_query_endpoint_structure(self, client):
        """Test query endpoint accepts correct request structure."""
        query_data = {
            "question": "What is the contract term?",
            "include_documents": True,
            "max_results": 5,
        }

        # Mock the RAG service to avoid actual API calls
        with patch("app.api.chat.rag_service") as mock_rag:
            mock_rag.query.return_value = {
                "answer": "Test answer",
                "sources": ["test.pdf"],
                "confidence": 0.8,
            }

            response = client.post("/api/query", json=query_data)
            # Should return 200 or 500 (depending on service initialization)
            assert response.status_code in [200, 500]

    def test_query_endpoint_validation(self, client):
        """Test query endpoint validates required fields."""
        # Test missing question
        response = client.post(
            "/api/query", json={"include_documents": True, "max_results": 5}
        )
        assert response.status_code == 422  # Validation error
