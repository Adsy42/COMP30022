from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import os


def create_app(config_name=None):
    """Create and configure the Flask application."""
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)

    # Load configuration
    from .config import config_by_name

    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    CORS(app, origins=app.config["CORS_ORIGINS"])
    JWTManager(app)

    # Initialize MongoDB
    mongo_client = MongoClient(app.config["MONGODB_URI"])
    app.db = mongo_client[app.config["MONGODB_DB_NAME"]]

    # Create upload folder if it doesn't exist
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Register blueprints
    from .routes import main
    from .api import (
        templates,
        chats,
        uploads,
        admin,
        analytics,
        config_api,
        escalations,
        form_questions,
        analytics_dashboard,
    )

    app.register_blueprint(main)
    app.register_blueprint(templates.bp)
    app.register_blueprint(chats.bp)
    app.register_blueprint(uploads.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(analytics.bp)
    app.register_blueprint(config_api.bp)
    app.register_blueprint(escalations.bp)
    app.register_blueprint(form_questions.bp)
    app.register_blueprint(analytics_dashboard.bp)

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500

    return app
