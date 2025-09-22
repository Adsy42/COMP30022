import pytest
import os
from app.core.document_processor import DocumentProcessor


class TestDocumentProcessor:
    """Test document processing functionality."""
    
    def test_processor_initialization(self):
        """Test document processor initializes with correct settings."""
        processor = DocumentProcessor()
        assert processor is not None
        assert processor.text_splitter is not None
    
    def test_processor_with_custom_settings(self):
        """Test document processor with custom chunk settings."""
        processor = DocumentProcessor(chunk_size=500, chunk_overlap=100)
        assert processor.text_splitter._chunk_size == 500
        assert processor.text_splitter._chunk_overlap == 100
    
    def test_pdf_processing(self):
        """Test PDF document processing."""
        processor = DocumentProcessor()
        pdf_path = "data/documents/test_small.pdf"
        
        if os.path.exists(pdf_path):
            documents = processor.process_document(pdf_path)
            assert len(documents) > 0
            assert all(hasattr(doc, 'page_content') for doc in documents)
            assert all(hasattr(doc, 'metadata') for doc in documents)
            
            # Check metadata structure
            for doc in documents:
                assert 'source' in doc.metadata
                assert 'chunk_id' in doc.metadata
                assert 'file_type' in doc.metadata
                assert doc.metadata['file_type'] == 'pdf'
    
    def test_unsupported_file_type(self):
        """Test error handling for unsupported file types."""
        processor = DocumentProcessor()
        unsupported_path = "data/documents/sample_faqs.csv"
        
        with pytest.raises(ValueError, match="Unsupported file type"):
            processor.process_document(unsupported_path)
    
    def test_nonexistent_file(self):
        """Test error handling for nonexistent files."""
        processor = DocumentProcessor()
        nonexistent_path = "data/documents/nonexistent.pdf"
        
        with pytest.raises(Exception):
            processor.process_document(nonexistent_path)
    
    def test_document_chunking(self):
        """Test that documents are properly chunked."""
        processor = DocumentProcessor(chunk_size=100, chunk_overlap=20)
        pdf_path = "data/documents/test_small.pdf"
        
        if os.path.exists(pdf_path):
            documents = processor.process_document(pdf_path)
            
            # Check that chunks are reasonable size
            for doc in documents:
                assert len(doc.page_content) <= 100  # chunk_size
                assert len(doc.page_content) > 0
