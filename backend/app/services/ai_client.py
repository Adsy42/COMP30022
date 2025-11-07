"""AI Service client for communicating with the AI microservice."""

import requests
from flask import current_app

# SPARK AI INTEGRATION NOTE: This file handles communication with the AI microservice.
# When switching to Spark AI, the AI microservice will still be used as an intermediary,
# but you may need to update the AI service endpoints or request/response formats
# if Spark AI requires different API structures.


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
            # SPARK AI INTEGRATION NOTE: The endpoint remains the same, but you may need to adjust
            # the timeout value based on Spark AI's response times. Spark AI might be faster or slower
            # than Hugging Face, so monitor and adjust the timeout accordingly.
            response = requests.post(
                f"{ai_url}/api/analyze",
                json=chat_data,
                timeout=120,  # SPARK AI INTEGRATION: Adjust timeout based on Spark AI's performance
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
            # SPARK AI INTEGRATION NOTE: The embeddings endpoint remains the same, but you may need to
            # adjust the timeout based on Spark AI's embedding generation speed.
            response = requests.post(
                f"{ai_url}/api/embeddings",
                json={"text": text},
                timeout=10,  # SPARK AI INTEGRATION: Adjust timeout based on Spark AI's performance
            )
            response.raise_for_status()
            return response.json().get("embeddings", [])
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f"Embeddings request failed: {str(e)}")
            return []
