from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import os
import sys


def _auto_seed_database(app):
    """
    Automatically seed the database with essential data if it's empty.
    Only seeds: users, templates, and config (required for app to function).
    """
    try:
        # Check if templates collection is empty
        template_count = app.db["templates"].count_documents({})

        if template_count == 0:
            app.logger.info("Database appears empty. Auto-seeding essential data...")

            # Import seed functions
            # Add database directory to path
            db_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), "..", "database"
            )
            sys.path.insert(0, db_path)

            from seeds import seed_users, seed_templates, seed_config

            # Seed essential data
            users_count = seed_users(app.db)
            templates_count = seed_templates(app.db)
            config_count = seed_config(app.db)

            app.logger.info(
                f"✓ Auto-seeded: {users_count} users, {templates_count} templates, {config_count} config entries"
            )
            app.logger.info(
                "✓ Default admin credentials - username: admin, password: admin123"
            )
        else:
            app.logger.info(
                f"Database already initialized ({template_count} templates found)"
            )

    except Exception as e:
        app.logger.error(f"Error during auto-seeding: {str(e)}")
        # Don't crash the app if seeding fails
        app.logger.warning(
            "App will continue without seeded data. Run 'python seed_db.py --essential' manually."
        )


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

    # Auto-seed database if empty (essential data only)
    _auto_seed_database(app)

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
