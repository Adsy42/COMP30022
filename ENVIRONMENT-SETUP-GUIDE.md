# Environment Variables Setup Guide - Quick Reference

**Quick setup guide for all required environment variables**

---

## 🚀 Quick Start: What You Need Right Now

### For Local Development (Docker):

1. **Backend** - Create `backend/.env`
2. **AI Service** - Create `ai-service/.env`
3. **Frontend** - Create `frontend/.env.local`

### For Production Deployment:

1. **MongoDB Atlas** - Get connection string
2. **Railway** - Set variables in dashboard
3. **Vercel** - Set variables in dashboard
4. **GitHub** - Set secrets for CI/CD

---

## 📝 Step-by-Step Setup

### STEP 1: Backend Environment Variables

**File**: `backend/.env`

```bash
# Copy this exactly and replace values where indicated

# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
FLASK_SECRET_KEY=<RUN: python -c "import secrets; print(secrets.token_hex(32))">
JWT_SECRET_KEY=<RUN: python -c "import secrets; print(secrets.token_hex(32))">
PORT=5000

# MongoDB (Local Development)
MONGODB_URI=mongodb://admin:password123@mongo:27017/legal_ai?authSource=admin
MONGO_DATABASE=legal_ai

# AI Service (Local Development)
AI_SERVICE_URL=http://ai-service:8000

# Email Configuration (REQUIRED)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=<YOUR_GMAIL_ADDRESS>
EMAIL_PASSWORD=<YOUR_GMAIL_APP_PASSWORD>
EMAIL_FROM=Legal AI <YOUR_GMAIL_ADDRESS>
EMAIL_USE_TLS=true

# CORS (for frontend)
CORS_ORIGINS=http://localhost:3000
CORS_CREDENTIALS=true

# Uploads
UPLOAD_FOLDER=/app/uploads
MAX_UPLOAD_SIZE_MB=10

# Logging
LOG_LEVEL=DEBUG
```

**🔑 How to get Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Create a new app password for "Legal AI"
4. Copy the 16-character password
5. Paste it in `EMAIL_PASSWORD`

**🔑 Generate Secret Keys:**
```bash
# Run this in terminal to generate FLASK_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Run again for JWT_SECRET_KEY (use different value)
python -c "import secrets; print(secrets.token_hex(32))"
```

---

### STEP 2: AI Service Environment Variables

**File**: `ai-service/.env`

```bash
# Copy this exactly and replace values where indicated

# Service Configuration
PORT=8000
ENVIRONMENT=development
PYTHONUNBUFFERED=1

# OpenAI Configuration (REQUIRED)
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>

# Model Configuration (use defaults)
MODEL_NAME=gpt-4-turbo-preview
EMBEDDING_MODEL=text-embedding-3-small
MAX_TOKENS=4096
TEMPERATURE=0.7
TOP_P=0.9

# Vector Database (use defaults)
VECTOR_DB_TYPE=chromadb
VECTOR_DB_PATH=/app/data/vector_db
COLLECTION_NAME=legal_documents
EMBEDDING_DIMENSION=1536

# Document Processing (use defaults)
DOCUMENTS_PATH=/app/data/documents
MAX_DOCUMENT_SIZE_MB=10
ALLOWED_EXTENSIONS=pdf,docx,txt
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# Query Configuration (use defaults)
MAX_RESULTS=5

# Rate Limiting (disabled for dev)
RATE_LIMIT_ENABLED=false

# Logging
LOG_LEVEL=DEBUG
```

**🔑 How to get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Name it "Legal AI Development"
5. Copy the key (starts with `sk-proj-...`)
6. Paste it in `OPENAI_API_KEY`

**💰 Note**: OpenAI requires a paid account. Add $5-10 credit for testing.

---

### STEP 3: Frontend Environment Variables

**File**: `frontend/.env.local`

```bash
# Copy this exactly

# API Endpoints (for local Docker development)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Telemetry
NEXT_TELEMETRY_DISABLED=1
```

**✅ No changes needed** for local development!

---

## 🌐 Production Environment Variables

### PRODUCTION: MongoDB Atlas

**What you need**: MongoDB connection string

**Setup:**
1. Go to https://cloud.mongodb.com/
2. Create a cluster (M0 Free tier is fine)
3. Create database user: `legal_ai_user` with a password
4. Network Access: Add `0.0.0.0/0`
5. Click "Connect" → "Connect your application"
6. Copy connection string:
   ```
   mongodb+srv://legal_ai_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/legal_ai?retryWrites=true&w=majority
   ```

---

### PRODUCTION: Railway Backend

**Platform**: Railway Dashboard → Backend Service → Variables

```bash
FLASK_ENV=production
FLASK_SECRET_KEY=<GENERATE_NEW_64_CHAR_STRING>
JWT_SECRET_KEY=<GENERATE_NEW_64_CHAR_STRING>
PORT=5000

MONGODB_URI=<YOUR_MONGODB_ATLAS_CONNECTION_STRING>
MONGO_DATABASE=legal_ai

AI_SERVICE_URL=https://your-ai-service.railway.app

SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=<YOUR_GMAIL>
EMAIL_PASSWORD=<YOUR_GMAIL_APP_PASSWORD>
EMAIL_FROM=Legal AI <YOUR_GMAIL>
EMAIL_USE_TLS=true

CORS_ORIGINS=https://your-frontend.vercel.app
CORS_CREDENTIALS=true

UPLOAD_FOLDER=/app/uploads
MAX_UPLOAD_SIZE_MB=10

LOG_LEVEL=INFO
```

**⚠️ Important**:
- Generate NEW secret keys for production (don't reuse dev keys)
- Update `AI_SERVICE_URL` after deploying AI service
- Update `CORS_ORIGINS` with your Vercel domain

---

### PRODUCTION: Railway AI Service

**Platform**: Railway Dashboard → AI Service → Variables

```bash
PORT=8000
ENVIRONMENT=production
PYTHONUNBUFFERED=1

OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>

MODEL_NAME=gpt-4-turbo-preview
EMBEDDING_MODEL=text-embedding-3-small
MAX_TOKENS=4096
TEMPERATURE=0.7
TOP_P=0.9

VECTOR_DB_TYPE=chromadb
VECTOR_DB_PATH=/app/data/vector_db
COLLECTION_NAME=legal_documents
EMBEDDING_DIMENSION=1536

DOCUMENTS_PATH=/app/data/documents
MAX_DOCUMENT_SIZE_MB=10
ALLOWED_EXTENSIONS=pdf,docx,txt
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

MAX_RESULTS=5

RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

LOG_LEVEL=INFO
```

**⚠️ Note**: Enable rate limiting in production to control costs

---

### PRODUCTION: Vercel Frontend

**Platform**: Vercel Dashboard → Project → Settings → Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.railway.app
NEXT_TELEMETRY_DISABLED=1
```

**⚠️ Important**: Update URLs after Railway deployments

---

### PRODUCTION: GitHub Secrets

**Platform**: GitHub → Settings → Secrets and variables → Actions

#### Get Vercel Secrets:

```bash
# 1. Get Vercel Token
# Go to: https://vercel.com/account/tokens
# Create token, copy it

# 2. Get Project IDs
cd frontend
vercel link  # Follow prompts
cat .vercel/project.json  # Shows orgId and projectId
```

**GitHub Secrets to add:**
```
VERCEL_TOKEN=<from-vercel-account-settings>
VERCEL_ORG_ID=<from-.vercel/project.json>
VERCEL_PROJECT_ID=<from-.vercel/project.json>
```

#### Get Railway Secrets:

```bash
# 1. Get Railway Token
# Go to: https://railway.app/account/tokens
# Create token, copy it

# 2. Get Service IDs from URLs:
# Backend URL: railway.app/project/xxx/service/BACKEND_SERVICE_ID
# AI Service URL: railway.app/project/xxx/service/AI_SERVICE_ID
```

**GitHub Secrets to add:**
```
RAILWAY_TOKEN=<from-railway-account-settings>
RAILWAY_BACKEND_SERVICE_ID=<from-railway-backend-url>
RAILWAY_AI_SERVICE_ID=<from-railway-ai-service-url>
```

---

## ✅ Verification Checklist

### Local Development Setup

- [ ] Created `backend/.env` with all variables
- [ ] Generated Flask secret keys
- [ ] Added Gmail app password
- [ ] Created `ai-service/.env` with OpenAI key
- [ ] Created `frontend/.env.local`
- [ ] Run `make dev-up` and all services start
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:5000/health
- [ ] AI service responds at http://localhost:8000/health

### Production Setup

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] Railway backend service created
- [ ] Railway backend variables set
- [ ] Railway AI service created
- [ ] Railway AI service variables set
- [ ] Vercel project created
- [ ] Vercel variables set
- [ ] GitHub secrets configured (6 secrets total)
- [ ] Test deployment runs successfully

---

## 🔧 Common Issues

### "Connection refused" to MongoDB
**Problem**: MongoDB not running or wrong connection string

**Fix (Local)**:
```bash
docker-compose up mongo  # Start MongoDB
```

**Fix (Production)**:
- Check MongoDB Atlas network access allows `0.0.0.0/0`
- Verify connection string has correct password

---

### "OpenAI API key invalid"
**Problem**: Wrong API key or no credits

**Fix**:
1. Verify key starts with `sk-proj-`
2. Check https://platform.openai.com/account/billing
3. Add credits if balance is $0

---

### "CORS error" in browser
**Problem**: Backend not allowing frontend origin

**Fix**: Add frontend URL to `CORS_ORIGINS`:
```bash
# Local
CORS_ORIGINS=http://localhost:3000

# Production
CORS_ORIGINS=https://your-app.vercel.app
```

---

### "Email sending failed"
**Problem**: Gmail app password incorrect or 2FA not enabled

**Fix**:
1. Enable 2-Factor Authentication on Gmail
2. Generate new app password
3. Update `EMAIL_PASSWORD` in backend/.env

---

## 📚 Additional Resources

- [Full Environment Variables Reference](./docs/07-environment-variables.md)
- [Deployment Guide](./docs/06-deployment-guide.md)
- [Deployment Quick Start](./docs/DEPLOYMENT-QUICKSTART.md)

---

## 🆘 Quick Help

**Can't find a file?**
```bash
# List all environment files
find . -name ".env*" -o -name "*.env"
```

**Need to regenerate secrets?**
```bash
# Flask/JWT secret (64 characters)
python -c "import secrets; print(secrets.token_hex(32))"

# General secret (32 characters)
openssl rand -hex 32
```

**Check what's set in Railway/Vercel:**
- Railway: Dashboard → Service → Variables tab
- Vercel: Dashboard → Project → Settings → Environment Variables
- GitHub: Repo → Settings → Secrets and variables → Actions

---

**Pro Tip**: Copy the `.env.example` files and rename them:

```bash
# Backend
cp backend/.env.example backend/.env

# AI Service
cp ai-service/.env.example ai-service/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Then fill in the values marked with `<...>` placeholders.
