"""Main routes for health checks and root endpoints."""

from flask import Blueprint, jsonify

main = Blueprint("main", __name__)


@main.route("/")
def index():
    """Root endpoint."""
    return jsonify(
        {
            "message": "Legal AI Query & Referral System - Backend API",
            "version": "0.4.1",
            "status": "running",
        }
    )


@main.route("/health")
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"})
