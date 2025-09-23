# COMMENTED OUT - User only cares about root, health, and query endpoints
# This file has been disabled to focus only on essential endpoint testing

# import os
# from unittest.mock import patch


# class TestIntegration:
#     """Integration tests for the AI service."""

#     def test_document_upload_flow(self, client):
#         """Test complete document upload flow."""
#         # Test with actual PDF file
#         pdf_path = "data/documents/test_small.pdf"

#         if os.path.exists(pdf_path):
#             with open(pdf_path, "rb") as f:
#                 response = client.post(
#                     "/api/upload/document",
#                     files={"file": ("test_small.pdf", f, "application/pdf")},
#                 )
#                 assert response.status_code == 200
#                 data = response.json()
#                 assert "resource_id" in data

#                 # Test querying the uploaded document
#                 query_data = {
#                     "question": "What is this document about?",
#                     "include_documents": True,
#                     "max_results": 3,
#                 }

#                 with patch("app.api.chat.rag_service") as mock_rag:
#                     mock_rag.query.return_value = {
#                         "answer": "This is a test document",
#                         "sources": ["test_small.pdf"],
#                         "confidence": 0.9,
#                     }

#                     response = client.post("/api/query", json=query_data)
#                     assert response.status_code in [200, 500]

#     def test_faq_upload_flow(self, client):
#         """Test complete FAQ upload flow."""
#         # Test with actual CSV file
#         csv_path = "data/documents/sample_faqs.csv"

#         if os.path.exists(csv_path):
#             with open(csv_path, "rb") as f:
#                 response = client.post(
#                     "/api/upload/faq",
#                     files={"file": ("sample_faqs.csv", f, "text/csv")},
#                 )
#                 assert response.status_code == 200
#                 data = response.json()
#                 assert "resource_id" in data

#                 # Test querying the uploaded FAQ
#                 query_data = {
#                     "question": "What is a confidentiality agreement?",
#                     "include_documents": True,
#                     "max_results": 3,
#                 }

#                 with patch("app.api.chat.rag_service") as mock_rag:
#                     mock_rag.query.return_value = {
#                         "answer": "A confidentiality agreement is...",
#                         "sources": ["sample_faqs.csv"],
#                         "confidence": 0.8,
#                     }

#                     response = client.post("/api/query", json=query_data)
#                     assert response.status_code in [200, 500]

#     def test_end_to_end_workflow(self, client):
#         """Test complete end-to-end workflow."""
#         # 1. Upload a document
#         pdf_path = "data/documents/test_small.pdf"
#         if os.path.exists(pdf_path):
#             with open(pdf_path, "rb") as f:
#                 upload_response = client.post(
#                     "/api/upload/document",
#                     files={"file": ("test_small.pdf", f, "application/pdf")},
#                 )
#                 assert upload_response.status_code == 200
#                 resource_id = upload_response.json()["resource_id"]

#                 # 2. Check resources list
#                 resources_response = client.get("/api/resources")
#                 assert resources_response.status_code == 200
#                 resources = resources_response.json()
#                 assert len(resources) > 0

#                 # 3. Query the document
#                 query_data = {
#                     "question": "What are the key terms?",
#                     "include_documents": True,
#                     "max_results": 5,
#                 }

#                 with patch("app.api.chat.rag_service") as mock_rag:
#                     mock_rag.query.return_value = {
#                         "answer": "The key terms include...",
#                         "sources": ["test_small.pdf"],
#                         "confidence": 0.85,
#                     }

#                     query_response = client.post("/api/query", json=query_data)
#                     assert query_response.status_code in [200, 500]

#                     if query_response.status_code == 200:
#                         data = query_response.json()
#                         assert "answer" in data
#                         assert "sources" in data
#                         assert "confidence" in data

#                 # 4. Delete the resource
#                 delete_response = client.delete(f"/api/resources/{resource_id}")
#                 assert delete_response.status_code == 200

#     def test_error_handling(self, client):
#         """Test error handling in various scenarios."""
#         # Test invalid file upload
#         response = client.post(
#             "/api/upload/document",
#             files={"file": ("test.txt", b"content", "text/plain")},
#         )
#         assert response.status_code == 400

#         # Test invalid query data
#         response = client.post("/api/query", json={})
#         assert response.status_code == 422

#         # Test deleting nonexistent resource
#         response = client.delete("/api/resources/nonexistent")
#         assert response.status_code == 404
