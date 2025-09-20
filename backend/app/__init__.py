from flask import Flask


def create_app(config_name="development"):
    app = Flask(__name__)

    # Basic configuration
    app.config["SECRET_KEY"] = "dev-secret-key"

    # Register routes
    from .routes import main

    app.register_blueprint(main)

    return app
