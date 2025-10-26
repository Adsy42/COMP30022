# Environment Variables Reference

> **Back to:** [Documentation Index](./README.md) | [Deployment Guide](./06-deployment-guide.md)

## Overview

This document provides a comprehensive reference for all environment variables used across the Legal AI Query & Referral System services.

## Environment Files

The project uses different environment files for different contexts:

```
.
├── backend/
│   ├── .env                 # Local development (not in git)
│   ├── .env.example         # Template for local setup
│   └── .env.production      # Production (Railway dashboard)
├── ai-service/
│   ├── .env                 # Local development (not in git)
│   ├── .env.example         # Template for local setup
│   └── .env.production      # Production (Railway dashboard)
└── frontend/
    ├── .env.local           # Local development (not in git)
    ├── .env.example         # Template for local setup
    └── .env.production      # Production (Vercel dashboard)
```

## Backend Service (Flask)

### Required Variables

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `FLASK_ENV` | Flask environment mode | `development` or `production` | All |
| `FLASK_SECRET_KEY` | Secret key for sessions | `abc123...` (64 chars) | All |
| `PORT` | Port to run the service | `5000` | All |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` | All |
| `AI_SERVICE_URL` | URL of AI service | `http://ai-service:8000` (dev)<br>`https://ai-service.railway.app` (prod) | All |

### Email Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `SMTP_SERVER` | SMTP server hostname | `smtp.gmail.com` | All |
| `SMTP_PORT` | SMTP server port | `587` (TLS) or `465` (SSL) | All |
| `EMAIL_USER` | Email account username | `legal-ai@unimelb.edu.au` | All |
| `EMAIL_PASSWORD` | Email account password | `app-specific-password` | All |
| `EMAIL_FROM` | From email address | `Legal AI <legal-ai@unimelb.edu.au>` | All |
| `EMAIL_USE_TLS` | Use TLS encryption | `true` | All |

### ServiceNow Integration (Optional)

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `SERVICENOW_INSTANCE` | ServiceNow instance URL | `unimelb.service-now.com` | Production |
| `SERVICENOW_USERNAME` | ServiceNow API username | `api-user` | Production |
| `SERVICENOW_PASSWORD` | ServiceNow API password | `secure-password` | Production |
| `SERVICENOW_API_PATH` | API endpoint path | `/api/now/table/incident` | Production |

### CORS Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:3000,https://app.vercel.app` | All |
| `CORS_CREDENTIALS` | Allow credentials | `true` | All |

### Example Backend .env File

```bash
# Development Environment
# Copy to backend/.env and update values

# Flask Configuration
FLASK_ENV=development
FLASK_SECRET_KEY=generate-with-secrets-token-hex
PORT=5000

# MongoDB (Local Development)
MONGODB_URI=mongodb://admin:password123@mongo:27017/legal_ai?authSource=admin

# AI Service (Local Development)
AI_SERVICE_URL=http://ai-service:8000

# Email Configuration (Gmail Example)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Legal AI <your-email@gmail.com>
EMAIL_USE_TLS=true

# ServiceNow (Optional - Production Only)
# SERVICENOW_INSTANCE=your-instance.service-now.com
# SERVICENOW_USERNAME=api-user
# SERVICENOW_PASSWORD=secure-password

# CORS Configuration
CORS_ORIGINS=http://localhost:3000
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=DEBUG
```

## AI Service (FastAPI)

### Required Variables

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `PORT` | Port to run the service | `8000` | All |
| `ENVIRONMENT` | Runtime environment | `development` or `production` | All |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` | All |

### AI/LLM Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `MODEL_NAME` | OpenAI model to use | `gpt-4-turbo-preview` | All |
| `EMBEDDING_MODEL` | Embedding model | `text-embedding-3-small` | All |
| `MAX_TOKENS` | Max tokens per request | `4096` | All |
| `TEMPERATURE` | Model temperature | `0.7` | All |
| `TOP_P` | Nucleus sampling parameter | `0.9` | All |

### Vector Database Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `VECTOR_DB_TYPE` | Type of vector database | `chromadb` or `faiss` | All |
| `VECTOR_DB_PATH` | Path to vector database | `/app/data/vector_db` | All |
| `COLLECTION_NAME` | ChromaDB collection name | `legal_documents` | All |
| `EMBEDDING_DIMENSION` | Embedding vector dimension | `1536` | All |

### Document Processing

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `DOCUMENTS_PATH` | Path to document storage | `/app/data/documents` | All |
| `MAX_DOCUMENT_SIZE_MB` | Max document size | `10` | All |
| `ALLOWED_EXTENSIONS` | Allowed file extensions | `pdf,docx,txt` | All |
| `CHUNK_SIZE` | Text chunk size | `1000` | All |
| `CHUNK_OVERLAP` | Chunk overlap size | `200` | All |

### Rate Limiting

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `true` | Production |
| `RATE_LIMIT_REQUESTS` | Requests per window | `100` | Production |
| `RATE_LIMIT_WINDOW_SECONDS` | Rate limit window | `60` | Production |

### Example AI Service .env File

```bash
# Development Environment
# Copy to ai-service/.env and update values

# Service Configuration
PORT=8000
ENVIRONMENT=development

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-api-key-here

# Model Configuration
MODEL_NAME=gpt-4-turbo-preview
EMBEDDING_MODEL=text-embedding-3-small
MAX_TOKENS=4096
TEMPERATURE=0.7
TOP_P=0.9

# Vector Database
VECTOR_DB_TYPE=chromadb
VECTOR_DB_PATH=/app/data/vector_db
COLLECTION_NAME=legal_documents
EMBEDDING_DIMENSION=1536

# Document Processing
DOCUMENTS_PATH=/app/data/documents
MAX_DOCUMENT_SIZE_MB=10
ALLOWED_EXTENSIONS=pdf,docx,txt
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# Rate Limiting
RATE_LIMIT_ENABLED=false
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# Logging
LOG_LEVEL=DEBUG
```

## Frontend (Next.js)

### Required Variables

All frontend environment variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` (dev)<br>`https://backend.railway.app` (prod) | All |
| `NEXT_PUBLIC_AI_SERVICE_URL` | AI Service URL | `http://localhost:8000` (dev)<br>`https://ai-service.railway.app` (prod) | All |

### Optional Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `true` | Production |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics ID | `G-XXXXXXXXXX` | Production |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking | `https://xxx@sentry.io/xxx` | Production |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `1` | All |

### Example Frontend .env.local File

```bash
# Development Environment
# Copy to frontend/.env.local and update values

# API Endpoints (Development - Docker)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Telemetry
NEXT_TELEMETRY_DISABLED=1
```

## Database (MongoDB)

### Docker Compose Variables

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username | `admin` | Development |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password | `password123` | Development |
| `MONGO_INITDB_DATABASE` | Initial database name | `legal_ai` | Development |

### MongoDB Atlas (Production)

MongoDB Atlas configuration is done via the connection string in `MONGODB_URI`.

Example connection string format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## GitHub Secrets (CI/CD)

Required secrets for GitHub Actions workflows:

### Vercel Deployment

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Vercel authentication token | [Account Settings → Tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel organization ID | Run `vercel link` in frontend dir |
| `VERCEL_PROJECT_ID` | Vercel project ID | Check `.vercel/project.json` |

### Railway Deployment

| Secret | Description | How to Get |
|--------|-------------|------------|
| `RAILWAY_TOKEN` | Railway authentication token | [Account Settings → Tokens](https://railway.app/account/tokens) |
| `RAILWAY_BACKEND_SERVICE_ID` | Backend service ID | Railway project URL |
| `RAILWAY_AI_SERVICE_ID` | AI service service ID | Railway project URL |

## Security Best Practices

### 1. Never Commit Secrets

- Add `.env` files to `.gitignore`
- Use `.env.example` templates with placeholder values
- Never commit API keys or passwords

### 2. Use Strong Secrets

Generate secure secrets:

```bash
# Flask Secret Key (64 characters)
python -c "import secrets; print(secrets.token_hex(32))"

# General Purpose Secret (32 characters)
openssl rand -hex 32

# URL-safe Token
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Rotate Secrets Regularly

- Rotate API keys every 90 days
- Update passwords quarterly
- Log secret rotation events

### 4. Use Environment-Specific Secrets

- Different secrets for dev/staging/production
- Never reuse production secrets in development
- Separate API keys per environment

### 5. Principle of Least Privilege

- Grant minimal permissions required
- Use service-specific credentials
- Avoid root/admin accounts where possible

## Troubleshooting

### Issue: Variables Not Loading

**Symptoms**: Application can't find environment variables

**Solutions**:
1. Check file name: `.env` (not `.env.txt` or `.env.local.txt`)
2. Verify file location (root of service directory)
3. Restart service after adding variables
4. Check for typos in variable names
5. Ensure no spaces around `=` sign

### Issue: Frontend Variables Not Working

**Symptoms**: `undefined` values in browser

**Solutions**:
1. Verify `NEXT_PUBLIC_` prefix
2. Restart Next.js dev server
3. Clear `.next` cache: `rm -rf .next`
4. Check browser console for errors

### Issue: Production Variables Not Applied

**Symptoms**: Works locally but fails in production

**Solutions**:
1. Verify variables are set in platform dashboard (Vercel/Railway)
2. Check environment is correct (production vs preview)
3. Redeploy after setting variables
4. Check deployment logs for errors

## Environment Variable Checklist

Use this checklist when setting up a new environment:

### Development Setup

- [ ] Copy `.env.example` to `.env` in each service
- [ ] Update MongoDB connection string
- [ ] Set Flask secret key
- [ ] Configure email settings (optional for dev)
- [ ] Set CORS origins to `http://localhost:3000`
- [ ] Verify all services can communicate

### Production Setup

- [ ] Set up MongoDB Atlas and get connection string
- [ ] Generate strong secrets for Flask
- [ ] Configure production email (SMTP)
- [ ] Set OpenAI API key
- [ ] Configure ServiceNow (if applicable)
- [ ] Set all variables in Vercel dashboard
- [ ] Set all variables in Railway dashboard
- [ ] Configure GitHub secrets
- [ ] Test deployment pipeline
- [ ] Verify environment variable security

## Additional Resources

- [12-Factor App Environment Variables](https://12factor.net/config)
- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Railway Environment Variables Docs](https://docs.railway.app/develop/variables)
- [Next.js Environment Variables Docs](https://nextjs.org/docs/basic-features/environment-variables)
- [Flask Configuration Docs](https://flask.palletsprojects.com/en/2.3.x/config/)
