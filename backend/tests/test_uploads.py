"""Tests for file upload endpoints."""

import io


class TestUploads:
    """Test POST /uploads endpoint."""

    def test_upload_file_success(self, client, sample_chat):
        """Test uploading a file successfully."""
        data = {
            "chat_id": sample_chat.chat_id,
            "file": (io.BytesIO(b"test file content"), "test.pdf"),
        }
        response = client.post(
            "/uploads", data=data, content_type="multipart/form-data"
        )
        assert response.status_code == 201
        json_data = response.get_json()
        assert "fileId" in json_data
        assert json_data["fileId"].startswith("f_")
        assert json_data["name"] == "test.pdf"
        assert "size" in json_data
        assert "mime" in json_data

    def test_upload_missing_chat_id(self, client):
        """Test uploading without chat_id."""
        data = {"file": (io.BytesIO(b"content"), "test.pdf")}
        response = client.post(
            "/uploads", data=data, content_type="multipart/form-data"
        )
        assert response.status_code == 400

    def test_upload_nonexistent_chat(self, client):
        """Test uploading to non-existent chat."""
        data = {
            "chat_id": "chat_nonexistent",
            "file": (io.BytesIO(b"content"), "test.pdf"),
        }
        response = client.post(
            "/uploads", data=data, content_type="multipart/form-data"
        )
        assert response.status_code == 404

    def test_upload_missing_file(self, client, sample_chat):
        """Test uploading without file."""
        data = {"chat_id": sample_chat.chat_id}
        response = client.post(
            "/uploads", data=data, content_type="multipart/form-data"
        )
        assert response.status_code == 400

    def test_upload_invalid_file_type(self, client, sample_chat):
        """Test uploading file with invalid extension."""
        data = {
            "chat_id": sample_chat.chat_id,
            "file": (io.BytesIO(b"content"), "test.exe"),
        }
        response = client.post(
            "/uploads", data=data, content_type="multipart/form-data"
        )
        assert response.status_code == 415

    def test_upload_txt_file(self, client, sample_chat):
        """Test uploading a text file."""
        data = {
            "chat_id": sample_chat.chat_id,
            "file": (io.BytesIO(b"text content"), "document.txt"),
        }
        response = client.post(
            "/uploads", data=data, content_type="multipart/form-data"
        )
        assert response.status_code == 201

    def test_upload_docx_file(self, client, sample_chat):
        """Test uploading a Word document."""
        data = {
            "chat_id": sample_chat.chat_id,
            "file": (io.BytesIO(b"docx content"), "document.docx"),
        }
        response = client.post(
            "/uploads", data=data, content_type="multipart/form-data"
        )
        assert response.status_code == 201
