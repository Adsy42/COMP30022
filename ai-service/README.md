# Legal AI RAG Service

A FastAPI-based microservice that provides Retrieval-Augmented Generation (RAG) capabilities for legal contract information using Pinecone vector database and Hugging Face models.

## 🚀 Features

- **Document Processing**: Upload and process PDF and Word documents
- **FAQ Management**: Upload and process Excel/CSV FAQ files
- **RAG Query System**: Ask questions and get AI-powered answers based on uploaded content
- **Vector Search**: Pinecone-powered semantic search for relevant information
- **RESTful API**: Clean, well-documented API endpoints
- **Docker Support**: Containerized for easy deployment and scaling
- **Comprehensive Testing**: Full test suite with unit and integration tests

## 🏗️ Architecture

```
ai-service/
├── app/
│   ├── api/           # API endpoints (chat, embeddings)
│   ├── core/          # Core functionality (RAG, processors)
│   ├── models/        # Pydantic data models
│   └── main.py        # FastAPI application
├── tests/             # Test suite
├── data/              # Data storage
└── requirements.txt   # Python dependencies
```

## 🛠️ Tech Stack

- **FastAPI**: Web framework
- **Pinecone**: Vector database for embeddings
- **Hugging Face**: LLM and embedding models
- **LangChain**: Document processing and RAG pipeline
- **Pydantic**: Data validation and serialization
- **Docker**: Containerization

## 📋 Prerequisites

- Python 3.11+
- Docker and Docker Compose
- Pinecone API key
- Hugging Face API token (optional)

## 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## 📚 API Documentation

### Core Endpoints

- `GET /` - Service status
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

### Query Endpoints

- `POST /api/query` - Query the knowledge base
- `GET /api/stats` - Get Pinecone index statistics
- `GET /api/resources` - List uploaded resources
- `DELETE /api/resources/{id}` - Delete a resource

### Upload Endpoints

- `POST /api/upload/document` - Upload PDF/Word documents
- `POST /api/upload/faq` - Upload Excel/CSV FAQ files

## 🔧 Configuration

Environment variables (see `.env.example`):

```bash
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=legalai

# Hugging Face Configuration
HF_TOKEN=your_huggingface_token

# Model Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Document Processing
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# Query Configuration
MAX_RESULTS=5
MAX_TOKENS=512
TEMPERATURE=0.7
```

## 🧪 Testing

Run the complete test suite:

```bash
# Local testing
cd ai-service
source venv/bin/activate
pytest

# Docker testing
docker-compose exec ai-service pytest

# Shell script testing
./tests/scripts/test_all.sh
```

## 🐳 Docker Deployment

### Development
```bash
# Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Start only AI service
docker-compose up ai-service
```

### Production
```bash
# Build and run
docker build -t legal-ai-service .
docker run -p 8000:8000 legal-ai-service
```

## 📊 Usage Examples

### Query the Knowledge Base
```bash
curl -X POST "http://localhost:8000/api/query" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the key terms in this contract?",
    "max_results": 5,
    "include_documents": true
  }'
```

### Upload a Document
```bash
curl -X POST "http://localhost:8000/api/upload/document" \
  -F "file=@contract.pdf"
```

### Upload FAQ Data
```bash
curl -X POST "http://localhost:8000/api/upload/faq" \
  -F "file=@faq_data.xlsx"
```

## 🔍 Monitoring

- **Health Check**: `GET /health`
- **Index Stats**: `GET /api/stats`
- **Resource List**: `GET /api/resources`

## 🛡️ Error Handling

The service includes comprehensive error handling:
- Input validation with Pydantic
- File type validation for uploads
- Graceful error responses with HTTP status codes
- Detailed error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is part of COMP30022 - Software Engineering Project.

## 👥 Team

- **Yusuf**: AI Service, RAG Implementation, Vector Database Integration

---

For detailed setup instructions, see [QUICKSTART.md](./QUICKSTART.md).
