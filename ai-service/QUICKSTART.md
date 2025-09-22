# 🚀 AI Service Quick Start Guide

Get your Legal AI RAG Service up and running in minutes!

## 📋 Prerequisites

- Docker and Docker Compose installed
- Pinecone account and API key
- Hugging Face account (optional, for better performance)

## ⚡ Quick Setup (5 minutes)

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd COMP30022/ai-service
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit with your API keys
nano .env
```

**Required environment variables:**
```bash
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=legalai
HF_TOKEN=your_huggingface_token_here  # Optional but recommended
```

### 3. Start with Docker
```bash
# From project root
cd /Users/yusufzahran/COMP30022
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 4. Verify Installation
```bash
# Check health
curl http://localhost:8000/health

# Check API docs
open http://localhost:8000/docs
```

## 🧪 Test Your Setup

### Run Quick Tests
```bash
# Test basic endpoints
./tests/scripts/health.sh

# Test document upload
./tests/scripts/upload_document.sh

# Test query functionality
./tests/scripts/query.sh

# Run all tests
./tests/scripts/test_all.sh
```

## 📚 First Steps

### 1. Upload a Document
```bash
curl -X POST "http://localhost:8000/api/upload/document" \
  -F "file=@your_contract.pdf"
```

### 2. Ask a Question
```bash
curl -X POST "http://localhost:8000/api/query" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the key terms in this contract?",
    "max_results": 5
  }'
```

### 3. Check Resources
```bash
curl http://localhost:8000/api/resources
```

## 🔧 Local Development

### Option 1: Virtual Environment
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run locally
python run.py
```

### Option 2: Docker Only
```bash
# Build and run AI service only
docker build -t ai-service .
docker run -p 8000:8000 --env-file .env ai-service
```

## 🐛 Troubleshooting

### Common Issues

**Port 5000 already in use:**
```bash
# Find and kill the process
lsof -i:5000
kill -9 <PID>

# Or use different port in docker-compose.yml
```

**Pinecone connection error:**
- Verify your API key in `.env`
- Check if the index `legalai` exists in Pinecone
- Ensure index has dimension 384 and cosine similarity

**Hugging Face token issues:**
- Token is optional but recommended
- Without token, you'll have rate limits
- Get token from: https://huggingface.co/settings/tokens

**Docker build fails:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Check Logs
```bash
# View AI service logs
docker-compose logs -f ai-service

# View all services
docker-compose logs -f
```

## 📊 Monitoring

### Health Checks
- **Service Health**: `GET /health`
- **Index Stats**: `GET /api/stats`
- **Resource Count**: `GET /api/resources`

### Performance
- Query response time: ~5-10 seconds
- Document processing: ~2-5 seconds per document
- Memory usage: ~2-4GB (with models loaded)

## 🚀 Next Steps

1. **Upload Documents**: Add your legal documents
2. **Upload FAQs**: Add frequently asked questions
3. **Test Queries**: Try different question types
4. **Monitor Performance**: Check stats and logs
5. **Integrate**: Connect with frontend/backend

## 📖 API Reference

### Query Endpoint
```bash
POST /api/query
{
  "question": "Your question here",
  "max_results": 5,
  "include_documents": true
}
```

### Upload Document
```bash
POST /api/upload/document
Content-Type: multipart/form-data
file: [PDF or Word file]
```

### Upload FAQ
```bash
POST /api/upload/faq
Content-Type: multipart/form-data
file: [Excel or CSV file]
```

## 🆘 Need Help?

- **API Documentation**: http://localhost:8000/docs
- **Test Scripts**: `./tests/scripts/`
- **Logs**: `docker-compose logs ai-service`
- **Issues**: Check the main project repository

---

**🎉 You're all set!** Your AI service is ready to process legal documents and answer questions.
