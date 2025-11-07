"""File upload API endpoints."""

from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
import os
import uuid

bp = Blueprint("uploads", __name__, url_prefix="")


@bp.route("/uploads", methods=["POST"])
def upload_file():
    """
    POST /uploads
    Upload a file and link it to a chat.
    Form data:
        - chat_id: string (required)
        - file: binary file (required)

    Returns: {
        "fileId": "f_xxxxx",
        "name": "filename.pdf",
        "size": 12345,
        "mime": "application/pdf"
    }
    """
    try:
        # Check if chat_id is provided
        chat_id = request.form.get("chat_id")
        if not chat_id:
            return jsonify({"error": "chat_id is required"}), 400

        # Verify chat exists
        from ..models.chat import Chat

        chat = Chat.find_by_chat_id(current_app.db, chat_id)
        if not chat:
            return jsonify({"error": "chat_id not found"}), 404

        # Check if file is in request
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported media type"}), 415

        # Generate unique file ID and save file
        file_id = f"f_{uuid.uuid4().hex[:8]}"
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
        stored_filename = f"{file_id}.{file_extension}"

        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, stored_filename)

        # Save file
        file.save(file_path)
        file_size = os.path.getsize(file_path)

        # Get MIME type
        mime_type = file.content_type or "application/octet-stream"

        # Store file metadata in database
        file_metadata = {
            "file_id": file_id,
            "chat_id": chat_id,
            "original_name": filename,
            "stored_name": stored_filename,
            "file_path": file_path,
            "size": file_size,
            "mime_type": mime_type,
        }

        current_app.db["uploads"].insert_one(file_metadata)

        return (
            jsonify(
                {
                    "fileId": file_id,
                    "name": filename,
                    "size": file_size,
                    "mime": mime_type,
                }
            ),
            201,
        )

    except Exception as e:
        current_app.logger.error(f"Error uploading file: {str(e)}")
        return jsonify({"error": "Failed to upload file", "message": str(e)}), 500


def allowed_file(filename):
    """Check if file extension is allowed."""
    if not filename or "." not in filename:
        return False
    extension = filename.rsplit(".", 1)[1].lower()
    return extension in current_app.config["ALLOWED_EXTENSIONS"]
