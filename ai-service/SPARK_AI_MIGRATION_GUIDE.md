# 🔄 Spark AI Migration Guide

This guide provides comprehensive instructions for switching from Hugging Face to Spark AI in the Legal AI Query & Referral System.

---

## Overview

The system currently uses Hugging Face models for both embeddings and LLM inference. This guide explains how to migrate to Spark AI while maintaining the same functionality and API interfaces.

## Architecture Impact

The migration primarily affects the **AI microservice** (`ai-service/`). The backend and frontend will continue to work unchanged as they communicate with the AI service through the same REST API endpoints.

## Files That Need Changes

### 1. AI Service Configuration (`ai-service/app/config.py`)

**Current State:**
- Uses `HF_TOKEN` for Hugging Face authentication
- Uses Hugging Face model identifiers

**Changes Required:**
- Replace `HF_TOKEN` with `SPARK_API_KEY`
- Update `EMBEDDING_MODEL` to Spark AI's embedding model identifier
- Update `LLM_MODEL` to Spark AI's LLM model identifier

### 2. RAG Service (`ai-service/app/core/rag.py`)

**Current State:**
- Uses `HuggingFaceEmbeddings` for text embeddings
- Uses `InferenceClient` for LLM inference
- Implements Hugging Face's chat completion format

**Changes Required:**
- Replace `HuggingFaceEmbeddings` with Spark AI's embedding client
- Replace `InferenceClient` with Spark AI's LLM client
- Update the `_initialize_llm()` method to use Spark AI's initialization
- Modify the `query()` method to use Spark AI's completion API format
- Update the `get_embeddings()` method to use Spark AI's embedding API

### 3. Dependencies (`ai-service/requirements.txt`)

**Current State:**
- Uses `langchain-huggingface`, `huggingface-hub`, `transformers`, `torch`, `sentence-transformers`

**Changes Required:**
- Remove Hugging Face specific dependencies
- Add Spark AI's Python SDK
- Keep `langchain` and `langchain-pinecone` for document processing and vector storage

### 4. Environment Variables

**Current State:**
- Uses `HF_TOKEN` or `HUGGINGFACE_API_TOKEN`

**Changes Required:**
- Replace with `SPARK_API_KEY`
- Update model identifiers in environment variables

## Step-by-Step Migration Process

### Step 1: Update Dependencies

1. **Remove Hugging Face dependencies:**
   ```bash
   # Remove these from requirements.txt:
   langchain-huggingface>=0.1.0
   huggingface-hub>=0.20.0
   transformers>=4.36.0
   torch>=2.6.0
   sentence-transformers>=2.6.0
   ```

2. **Add Spark AI SDK:**
   - Check Spark AI documentation for the correct Python package name
   - Add the Spark AI SDK to requirements.txt
   - Verify the package name and version requirements

### Step 2: Update Configuration

1. **Update `ai-service/app/config.py`:**
   - Replace `HF_TOKEN` with `SPARK_API_KEY`
   - Update model identifiers to Spark AI's model names
   - Adapt any model-specific configuration parameters to Spark AI's requirements

### Step 3: Update RAG Service

1. **Update imports in `ai-service/app/core/rag.py`:**
   - Replace Hugging Face imports with Spark AI's SDK imports
   - Check Spark AI documentation for the correct import statements

2. **Update initialization:**
   - Replace `HuggingFaceEmbeddings` with Spark AI's embedding client
   - Replace `InferenceClient` with Spark AI's client
   - Adapt initialization parameters to Spark AI's requirements

3. **Update query method:**
   - Replace Hugging Face completion calls with Spark AI's API
   - Adapt prompt format to Spark AI's requirements
   - Update response parsing to match Spark AI's response structure
   - Handle any Spark AI-specific parameters or options

### Step 4: Update Environment Variables

1. **Update `.env` files:**
   - Replace `HF_TOKEN` with `SPARK_API_KEY`
   - Update model identifiers to Spark AI's model names
   - Check Spark AI documentation for the correct model identifiers

### Step 5: Test Integration

1. **Start the services:**
   ```bash
   docker-compose up --build
   ```

2. **Test AI functionality:**
   - Upload a document
   - Query the knowledge base
   - Verify embeddings generation
   - Test chat analysis

## Code Comments Reference

Throughout the codebase, you'll find comments marked with `SPARK AI INTEGRATION NOTE:` that identify specific change points:

**Key Files with Integration Comments:**
- `ai-service/app/config.py` - Configuration migration notes
- `ai-service/app/core/rag.py` - LLM and embedding integration points
- `ai-service/requirements.txt` - Dependency changes needed
- `backend/app/services/ai_client.py` - API client modifications
- `docker-compose.yml` - Environment variable updates

## API Compatibility

The migration maintains full API compatibility:

- **Backend → AI Service:** No changes required
- **Frontend → Backend:** No changes required
- **AI Service Endpoints:** Same endpoints, same request/response format

## Performance Considerations

1. **Response Times:** Monitor Spark AI's response times and adjust timeouts in `backend/app/services/ai_client.py` if needed
2. **Rate Limits:** Check Spark AI's rate limits and implement appropriate throttling if necessary
3. **Error Handling:** Ensure Spark AI's error responses are handled appropriately

## Rollback Plan

If issues arise during migration:

1. **Revert code changes** to the previous commit
2. **Restore environment variables** to Hugging Face configuration
3. **Rebuild containers** with original dependencies
4. **Test functionality** to ensure system is working

## Testing Checklist

- [ ] Document upload and processing works
- [ ] FAQ upload and processing works
- [ ] Query endpoint returns appropriate responses
- [ ] Embeddings generation works
- [ ] Chat analysis endpoint functions correctly
- [ ] Error handling works as expected
- [ ] Performance is acceptable
- [ ] All existing tests pass

## Support and Documentation

- **Spark AI Documentation:** Check Spark AI's official documentation for:
  - Python SDK installation and setup
  - API reference and authentication
  - Model identifiers and configuration
  - Rate limits and usage guidelines
- **Community Support:** Check Spark AI's community forums or support channels

## Notes

- The Pinecone vector database integration remains unchanged
- Document processing (PDF, Word, Excel) remains unchanged
- The RAG pipeline architecture remains the same
- Only the AI model inference layer changes

---

**Important:** This migration should be thoroughly tested in a development environment before deploying to production. Consider implementing feature flags or gradual rollout strategies for production deployment.
