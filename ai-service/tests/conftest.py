import pytest
import os
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    with TestClient(app) as client:
        yield client


@pytest.fixture
def test_documents_dir():
    """Get the test documents directory path."""
    return "data/documents"


@pytest.fixture
def sample_pdf():
    """Get path to sample PDF file."""
    return "data/documents/test_small.pdf"


@pytest.fixture
def sample_csv():
    """Get path to sample CSV file."""
    return "data/documents/sample_faqs.csv"


@pytest.fixture(autouse=True)
def setup_test_environment():
    """Set up test environment before each test."""
    # Set test environment variables
    os.environ["PINECONE_API_KEY"] = "test-key"
    os.environ["HF_TOKEN"] = "test-token"
    os.environ["CHUNK_SIZE"] = "100"
    os.environ["CHUNK_OVERLAP"] = "20"
    yield
    # Cleanup after test
    pass