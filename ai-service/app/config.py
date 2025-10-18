import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    # Pinecone Configuration
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "legalai")

    # Hugging Face Configuration
    HF_TOKEN: str = os.getenv("HF_TOKEN", "") or os.getenv("HUGGINGFACE_API_TOKEN", "")

    # Model Configuration
    EMBEDDING_MODEL: str = os.getenv(
        "EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
    )
    LLM_MODEL: str = os.getenv("LLM_MODEL", "mistralai/Mistral-7B-Instruct-v0.2")

    # Service Configuration
    PYTHONUNBUFFERED: str = os.getenv("PYTHONUNBUFFERED", "1")

    # Document Processing
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "1000"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))

    # Query Configuration
    MAX_RESULTS: int = int(os.getenv("MAX_RESULTS", "5"))
    MAX_TOKENS: int = int(os.getenv("MAX_TOKENS", "512"))
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))


settings = Settings()
