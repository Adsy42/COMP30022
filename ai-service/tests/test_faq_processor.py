import pytest
import os
from app.core.faq_processor import FAQProcessor


class TestFAQProcessor:
    """Test FAQ processing functionality."""
    
    def test_processor_initialization(self):
        """Test FAQ processor initializes correctly."""
        processor = FAQProcessor()
        assert processor is not None
    
    def test_csv_processing(self):
        """Test CSV FAQ file processing."""
        processor = FAQProcessor()
        csv_path = "data/documents/sample_faqs.csv"
        
        if os.path.exists(csv_path):
            documents = processor.process_faq(csv_path)
            assert len(documents) > 0
            
            # Check document structure
            for doc in documents:
                assert hasattr(doc, 'page_content')
                assert hasattr(doc, 'metadata')
                assert 'type' in doc.metadata
                assert doc.metadata['type'] == 'faq'
                assert 'question' in doc.metadata
                assert 'answer' in doc.metadata
                assert 'row_id' in doc.metadata
    
    def test_excel_processing(self):
        """Test Excel FAQ file processing."""
        processor = FAQProcessor()
        excel_path = "data/documents/test_faq.csv"  # Using CSV as Excel test
        
        if os.path.exists(excel_path):
            documents = processor.process_faq(excel_path)
            assert len(documents) > 0
            
            # Check that content contains both question and answer
            for doc in documents:
                content = doc.page_content
                assert "Question:" in content
                assert "Answer:" in content
    
    def test_missing_columns(self):
        """Test error handling for missing required columns."""
        processor = FAQProcessor()
        
        # Create a temporary file with missing columns
        import pandas as pd
        temp_data = {'wrong_column': ['test']}
        temp_df = pd.DataFrame(temp_data)
        temp_path = "temp_test.csv"
        temp_df.to_csv(temp_path, index=False)
        
        try:
            with pytest.raises(ValueError, match="File must contain columns"):
                processor.process_faq(temp_path)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    def test_empty_faq_file(self):
        """Test handling of empty FAQ file."""
        processor = FAQProcessor()
        
        # Create empty CSV
        import pandas as pd
        empty_df = pd.DataFrame(columns=['question', 'answer'])
        temp_path = "temp_empty.csv"
        empty_df.to_csv(temp_path, index=False)
        
        try:
            documents = processor.process_faq(temp_path)
            assert len(documents) == 0
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)
    
    def test_get_faq_questions(self):
        """Test extracting questions from FAQ file."""
        processor = FAQProcessor()
        csv_path = "data/documents/sample_faqs.csv"
        
        if os.path.exists(csv_path):
            questions = processor.get_faq_questions(csv_path)
            assert len(questions) > 0
            assert all(isinstance(q, str) for q in questions)
            assert all(len(q.strip()) > 0 for q in questions)
    
    def test_nonexistent_file(self):
        """Test error handling for nonexistent files."""
        processor = FAQProcessor()
        nonexistent_path = "data/documents/nonexistent.csv"
        
        with pytest.raises(Exception):
            processor.process_faq(nonexistent_path)
