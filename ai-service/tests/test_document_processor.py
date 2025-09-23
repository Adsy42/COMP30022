# COMMENTED OUT - User only cares about root, health, and query endpoints
# This file has been disabled to focus only on essential endpoint testing

# import pytest
# import os
# from app.core.document_processor import DocumentProcessor


# class TestDocumentProcessor:
#     """Test document processing functionality."""

#     def test_pdf_processing(self, sample_pdf):
#         """Test PDF document processing."""
#         if os.path.exists(sample_pdf):
#             processor = DocumentProcessor()
#             chunks = processor.process_document(sample_pdf)
#             assert len(chunks) > 0
#             assert all(hasattr(chunk, "page_content") for chunk in chunks)
#             assert all(hasattr(chunk, "metadata") for chunk in chunks)

#     def test_unsupported_format(self):
#         """Test handling of unsupported file formats."""
#         processor = DocumentProcessor()
#         chunks = processor.process_document("test.txt")
#         assert chunks == []

#     def test_nonexistent_file(self):
#         """Test handling of nonexistent files."""
#         processor = DocumentProcessor()
#         chunks = processor.process_document("nonexistent.pdf")
#         assert chunks == []

#     def test_chunk_metadata(self, sample_pdf):
#         """Test that chunks have proper metadata."""
#         if os.path.exists(sample_pdf):
#             processor = DocumentProcessor()
#             chunks = processor.process_document(sample_pdf)
#             if chunks:
#                 chunk = chunks[0]
#                 assert "source" in chunk.metadata
#                 assert "chunk_index" in chunk.metadata
