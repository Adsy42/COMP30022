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
        template_count = app.db["templates"].count_documents({})
        form_question_count = app.db["form_questions"].count_documents({})
        analytics_count = app.db["analytics"].count_documents({})

        if template_count == 0 or form_question_count == 0 or analytics_count == 0:
            app.logger.info("Database appears incomplete. Auto-seeding data...")

            db_path = os.path.join(
                os.path.dirname(os.path.dirname(__file__)), "..", "database"
            )
            if db_path not in sys.path:
                sys.path.insert(0, db_path)

            from seeds import (
                seed_users,
                seed_templates,
                seed_config,
                seed_form_questions,
                seed_analytics,
            )

            if template_count == 0:
                templates_count = seed_templates(app.db)
                app.logger.info(f"✓ Seeded {templates_count} template records")
            else:
                templates_count = template_count
                app.logger.info("Templates already present; skipping seed")

            users_count = seed_users(app.db)
            app.logger.info(f"✓ Seeded {users_count} user records")
            config_count = seed_config(app.db)
            app.logger.info(f"✓ Seeded {config_count} config records")

            if form_question_count == 0:
                fq_count = seed_form_questions(app.db)
                app.logger.info(f"✓ Seeded {fq_count} form questions")
            else:
                fq_count = form_question_count
                app.logger.info("Form questions already present; skipping seed")

            if analytics_count == 0:
                analytics_seeded = seed_analytics(app.db)
                app.logger.info(f"✓ Seeded analytics data ({analytics_seeded} records)")
            else:
                analytics_seeded = analytics_count
                app.logger.info("Analytics already present; skipping seed")

            app.logger.info(
                "✓ Default admin credentials - username: admin, password: admin123"
            )
        else:
            app.logger.info(
                "Database already initialized (templates, form questions, analytics present)"
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
    mongo_uri = app.config["MONGODB_URI"]
    app.logger.info(f"Connecting to MongoDB: {mongo_uri}")
    mongo_client = MongoClient(mongo_uri)
    app.db = mongo_client[app.config["MONGODB_DB_NAME"]]
    app.logger.info(f"Connected to MongoDB database: {app.config['MONGODB_DB_NAME']}")

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

    api_prefix = app.config.get("API_URL_PREFIX", "/api")

    def _api_path(suffix: str = "") -> str:
        base = api_prefix.rstrip("/")
        if not base.startswith("/"):
            base = f"/{base}"
        return f"{base}{suffix}"

    app.logger.info(
        "Registering API blueprints with prefixes: %s",
        {
            "templates": _api_path(""),
            "chats": _api_path(""),
            "uploads": _api_path(""),
            "admin": _api_path(""),
            "analytics": _api_path(""),
            "config": _api_path(""),
            "escalations": _api_path(""),
            "form_questions": _api_path(""),
            "analytics_dashboard": _api_path(""),
        },
    )

    shared_prefix = _api_path("")
    app.register_blueprint(templates.bp, url_prefix=shared_prefix)
    app.register_blueprint(chats.bp, url_prefix=shared_prefix)
    app.register_blueprint(uploads.bp, url_prefix=shared_prefix)
    app.register_blueprint(admin.bp, url_prefix=shared_prefix)
    app.register_blueprint(analytics.bp, url_prefix=shared_prefix)
    app.register_blueprint(config_api.bp, url_prefix=shared_prefix)
    app.register_blueprint(escalations.bp, url_prefix=shared_prefix)
    app.register_blueprint(form_questions.bp, url_prefix=shared_prefix)
    app.register_blueprint(analytics_dashboard.bp, url_prefix=shared_prefix)

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500

    return app
