"""AI Service client for communicating with the AI microservice."""
import requests
from flask import current_app


class AIClient:
    """Client for AI service communication."""

    @staticmethod
    def analyze_query(chat_data):
        """
        Send chat data to AI service for RAG-based query analysis.
        Args:
            chat_data: Dictionary containing chat session data with 'question' field
        Returns:
            dict: AI response with 'status', 'answer', 'sources', and 'confidence'
        """
        try:
            ai_url = current_app.config["AI_SERVICE_URL"]
            
            # Extract question from chat_data - handle different possible structures
            question = None
            if isinstance(chat_data, dict):
                # Try different possible keys for the question
                question = (chat_data.get('question') or 
                        chat_data.get('message') or 
                        chat_data.get('text') or 
                        chat_data.get('content'))
            
            if not question:
                current_app.logger.error("No question found in chat_data")
                return {"status": "error", "response": "No question provided"}
            
            # Prepare request payload for /api/query endpoint
            query_payload = {
                "question": str(question),
                "include_documents": True,
                "max_results": 5
            }
            
            response = requests.post(
                f"{ai_url}/api/query",  # Changed from /api/analyze to /api/query
                json=query_payload,
                timeout=40,
            )
            response.raise_for_status()
            
            # Parse the RAG response
            rag_response = response.json()
            # Transform RAG response to match expected format
            return {
                "status": "success",
                "response": rag_response.get("answer", "No answer generated"),
                "sources": rag_response.get("sources", []),
                "confidence": rag_response.get("confidence", 0.0)
            }
            
            
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"AI service request failed: {str(e)}")
            return {"status": "error", "response": f"AI service unavailable: {str(e)}"}
        except Exception as e:
            current_app.logger.error(f"Unexpected error in analyze_query: {str(e)}")
            return {"status": "error", "response": f"Processing error: {str(e)}"}


    @staticmethod
    def get_embeddings(text):
        """
        Get text embeddings from AI service.

        Args:
            text: Text to get embeddings for

        Returns:
            list: Embedding vector
        """
        try:
            ai_url = current_app.config["AI_SERVICE_URL"]
            response = requests.post(
                f"{ai_url}/api/embeddings",
                json={"text": text},
                timeout=10,
            )
            response.raise_for_status()
            return response.json().get("embeddings", [])
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Embeddings request failed: {str(e)}")
            return []
