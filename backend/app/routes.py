from flask import Blueprint, jsonify

main = Blueprint("main", __name__)


@main.route("/")
def index():
    return jsonify({"message": "Backend API is running"})


@main.route("/health")
def health_check():
    return jsonify({"status": "healthy"})


@main.route("/api/example")
def example():
    return jsonify({"message": "This is an example endpoint - customize as needed"})
