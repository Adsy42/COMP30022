"""AI Service client for communicating with the AI microservice."""
import requests
from flask import current_app


class AIClient:
    """Client for AI service communication."""

    @staticmethod
    def analyze_query(chat_data):
        """
        Send chat data to AI service for analysis and response generation.

        Args:
            chat_data: Dictionary containing chat session data

        Returns:
            dict: AI response with 'status' and optional 'response' text
        """
        try:
            ai_url = current_app.config["AI_SERVICE_URL"]
            response = requests.post(
                f"{ai_url}/api/analyze",
                json=chat_data,
                timeout=120,  # Increased to 2 minutes for Hugging Face API
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"AI service request failed: {str(e)}")
            # Fallback: mark as complex if AI service fails
            return {"status": "complex", "response": None}

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
