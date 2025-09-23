# COMMENTED OUT - User only cares about root, health, and query endpoints
# This file has been disabled to focus only on essential endpoint testing

# import pytest
# import os
# from app.core.faq_processor import FAQProcessor


# class TestFAQProcessor:
#     """Test FAQ processing functionality."""

#     def test_csv_processing(self, sample_csv):
#         """Test CSV FAQ processing."""
#         if os.path.exists(sample_csv):
#             processor = FAQProcessor()
#             faq_docs = processor.process_faq(sample_csv)
#             assert len(faq_docs) > 0
#             assert all(hasattr(doc, "page_content") for doc in faq_docs)
#             assert all(hasattr(doc, "metadata") for doc in faq_docs)

#     def test_unsupported_format(self):
#         """Test handling of unsupported file formats."""
#         processor = FAQProcessor()
#         faq_docs = processor.process_faq("test.txt")
#         assert faq_docs == []

#     def test_nonexistent_file(self):
#         """Test handling of nonexistent files."""
#         processor = FAQProcessor()
#         faq_docs = processor.process_faq("nonexistent.csv")
#         assert faq_docs == []

#     def test_faq_metadata(self, sample_csv):
#         """Test that FAQ documents have proper metadata."""
#         if os.path.exists(sample_csv):
#             processor = FAQProcessor()
#             faq_docs = processor.process_faq(sample_csv)
#             if faq_docs:
#                 doc = faq_docs[0]
#                 assert "question" in doc.metadata
#                 assert "answer" in doc.metadata
#                 assert "row_id" in doc.metadata
