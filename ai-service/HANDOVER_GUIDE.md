# 🚀 AI Service Handover Guide

This guide will walk you through everything you need to get the AI service up and running with the current Hugging Face + Pinecone setup.

---

## 🏗️ Current Architecture

### AI Service Stack

**Vector Database: Pinecone**
- **Purpose**: Stores document embeddings for semantic search
- **Why Pinecone**: Industry-leading vector database with excellent performance and scalability
- **Privacy**: Data is encrypted in transit and at rest, with enterprise-grade security

**AI Models: Hugging Face**
- **Purpose**: Provides both embedding models and Large Language Models (LLMs)
- **Why Hugging Face**: Open-source models with transparent training data, extensive model library
- **Privacy**: Models run inference on your data without storing it permanently

**Document Processing: LangChain**
- **Purpose**: Handles document parsing, chunking, and RAG pipeline
- **Why LangChain**: Industry standard for document processing and AI workflows
- **Privacy**: Processes documents locally before sending to external services

---

## 📋 What You Need

1. **Docker** (must be installed)
2. **Pinecone Account** (create free account)
3. **Hugging Face Token** (requires subscription + tokens)

---

## Step 1: Get Your API Keys

### A. Create a Pinecone Account

1. Go to [https://www.pinecone.io/](https://www.pinecone.io/)
2. Sign up for a free account
3. Once logged in, go to **API Keys** in the sidebar
4. Copy your API key (starts with something like `pc-xxxxx`)
5. Keep this key - you'll need it in Step 3

### B. Create a Pinecone Index

1. In Pinecone dashboard, click **"Create Index"**
2. Set the following settings:
   - **Index Name**: `legalai`
   - **Metric**: `cosine`
   - **Dimensions**: `384`
   - **Cloud**: Choose your preferred region
   - **Plan**: Free tier is sufficient
3. Click **"Create Index"**
4. Wait for the index to be ready (takes 1-2 minutes)

### C. Get Hugging Face Token (Optional)

1. Go to [https://huggingface.co/](https://huggingface.co/)
2. Sign up or log in
3. Go to **Settings** → **Access Tokens**
4. Click **"New Token"**
5. Name it `legal-ai-token` and select `Read` permissions
6. Copy the token

---

## Step 2: Prepare Your Environment File

1. Navigate to the project directory:
   ```bash
   cd ai-service
   ```

2. Create a `.env` file in the `ai-service` directory:
   ```bash
   touch .env
   ```

3. Open the `.env` file and add the following:
   ```bash
   # Pinecone Configuration (REQUIRED)
   PINECONE_API_KEY=your_pinecone_api_key_here
   PINECONE_INDEX_NAME=legalai

   # Hugging Face Configuration (OPTIONAL but recommended)
   HF_TOKEN=your_huggingface_token_here

   # Optional: Adjust these if needed
   MAX_RESULTS=5
   MAX_TOKENS=512
   TEMPERATURE=0.7
   CHUNK_SIZE=1000
   CHUNK_OVERLAP=200
   ```

4. **Replace the placeholder values** with your actual API keys

---

## Step 3: Start the Service

### Option A: Using Docker (Recommended)

1. From the project root directory (`COMP30022`), run:
   ```bash
   docker-compose up --build ai-service
   ```

2. Wait for the service to start (first time will take 2-3 minutes to download dependencies)

3. You should see: `Application startup complete`

### Option B: Local Development

1. Make sure Python 3.11+ is installed
2. Navigate to `ai-service` directory:
   ```bash
   cd ai-service
   ```
3. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the service:
   ```bash
   python run.py
   ```

---

## Step 4: Verify the Service is Running

1. Open your browser and go to: [http://localhost:8000](http://localhost:8000)

2. You should see: `{"message": "Legal AI RAG Service is running"}`

3. Check health endpoint: [http://localhost:8000/health](http://localhost:8000/health)

---

## Step 5: Upload Your Documents

### Using the API Documentation (Easiest)

1. Go to [http://localhost:8000/docs](http://localhost:8000/docs)

2. Find the **`POST /api/upload/document`** endpoint

3. Click **"Try it out"**

4. Click **"Choose File"** and select a PDF file

5. Click **"Execute"**

6. You should see a success message with a `resource_id`

### Using Command Line

```bash
curl -X POST "http://localhost:8000/api/upload/document" \
  -F "file=@path/to/your/document.pdf"
```

---

## Step 6: Test Querying

### Using the API Documentation

1. Find the **`POST /api/query`** endpoint

2. Click **"Try it out"**

3. Enter a question, for example:
   ```json
   {
     "question": "What are the key terms in this contract?",
     "max_results": 5,
     "include_documents": true
   }
   ```

4. Click **"Execute"**

5. You should get an AI-powered answer based on your uploaded documents

### Using Command Line

```bash
curl -X POST "http://localhost:8000/api/query" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the key terms in this contract?",
    "max_results": 5
  }'
```

---

## ✅ What You Need to Do Summary

1. ✅ Create Pinecone account and index
2. ✅ Create Hugging Face token
3. ✅ Create `.env` file with API keys
4. ✅ Start the service with Docker
5. ✅ Upload PDF documents using the endpoint
6. ✅ Query the documents

---

## 📝 Useful Commands

### Check Service Status
```bash
curl http://localhost:8000/health
```

### View All Uploaded Resources
```bash
curl http://localhost:8000/api/resources
```

### Check Index Statistics
```bash
curl http://localhost:8000/api/stats
```

### View Logs
```bash
docker-compose logs -f ai-service
```

### Stop the Service
```bash
docker-compose down
```

---

## 🐛 Troubleshooting

### "Pinecone connection error"
- Check your API key in the `.env` file
- Make sure the index named `legalai` exists in Pinecone
- Verify the index has dimensions: 384 and metric: cosine

### "Module not found" or "Import error"
- Make sure you're in the correct directory
- Rebuild the Docker container: `docker-compose up --build ai-service`

### Service not responding
1. Check logs: `docker-compose logs ai-service`
2. Restart: `docker-compose restart ai-service`
3. Rebuild: `docker-compose up --build ai-service`

---

## 📚 API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Service status |
| `/health` | GET | Health check |
| `/docs` | GET | Interactive API docs |
| `/api/query` | POST | Ask questions |
| `/api/upload/document` | POST | Upload PDF files |
| `/api/resources` | GET | List uploaded resources |
| `/api/resources/{id}` | DELETE | Delete a resource |
| `/api/stats` | GET | Index statistics |

---

## 📞 Support

For issues or questions:
- Check the logs: `docker-compose logs ai-service`
- Review API documentation: http://localhost:8000/docs
- Verify your `.env` file has all required variables

---

**🎉 You're all set! Your AI service is ready to answer questions based on your uploaded documents.**
