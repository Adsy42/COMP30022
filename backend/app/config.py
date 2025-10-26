"""
Configuration settings for the Flask backend application.
"""

import os
from datetime import timedelta


class Config:
    """Base configuration."""

    # Flask
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG = False
    TESTING = False

    # MongoDB
    MONGODB_URI = os.getenv(
        "MONGODB_URI",
        "mongodb://admin:password123@mongo:27017/legal_ai?authSource=admin",
    )
    MONGODB_DB_NAME = os.getenv("MONGO_DATABASE", "legal_ai")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"

    # CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

    # AI Service
    AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://ai-service:8000")

    # Email Configuration
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    EMAIL_USER = os.getenv("EMAIL_USER", "")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")
    EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "true").lower() == "true"

    # File Upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "/app/uploads")
    ALLOWED_EXTENSIONS = {
        "pdf",
        "doc",
        "docx",
        "txt",
        "png",
        "jpg",
        "jpeg",
        "xls",
        "xlsx",
    }


class DevelopmentConfig(Config):
    """Development configuration."""

    DEBUG = True
    TESTING = False


class TestingConfig(Config):
    """Testing configuration."""

    DEBUG = True
    TESTING = True
    # Use mongo service when in Docker, localhost otherwise
    MONGODB_URI = os.getenv(
        "MONGODB_TEST_URI",
        "mongodb://admin:password123@mongo:27017/legal_ai_test?authSource=admin",
    )


class ProductionConfig(Config):
    """Production configuration."""

    DEBUG = False
    TESTING = False
    # In production, SECRET_KEY and JWT_SECRET_KEY must be set via environment variables


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
