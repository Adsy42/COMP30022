# 🚀 Production Environment Variables - Copy & Paste Guide

**Quick reference for deploying to Railway and Vercel**

---

## 📊 MongoDB Atlas - ✅ DONE

**Connection String**:
```
mongodb+srv://Adsy42:Coolbro-13@cluster0.ismq8yq.mongodb.net/legal_ai?retryWrites=true&w=majority&appName=Cluster0
```

✅ Already updated in `backend/.env`

**Next Steps in MongoDB Atlas**:
1. Go to https://cloud.mongodb.com/
2. Navigate to your cluster → Collections
3. Create database: `legal_ai`
4. Create collections:
   - `queries`
   - `form_templates`
   - `analytics`
   - `users`

---

## 🚂 Railway - Backend Service

**Platform**: Railway Dashboard → Backend Service → Variables

Copy and paste these into Railway (update values marked with `⚠️`):

```bash
# Flask Configuration
FLASK_ENV=production
FLASK_SECRET_KEY=⚠️GENERATE_NEW_ONE_FOR_PRODUCTION
JWT_SECRET_KEY=⚠️GENERATE_NEW_ONE_FOR_PRODUCTION
PORT=5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://Adsy42:Coolbro-13@cluster0.ismq8yq.mongodb.net/legal_ai?retryWrites=true&w=majority&appName=Cluster0
MONGO_DATABASE=legal_ai

# AI Service (update after AI service is deployed)
AI_SERVICE_URL=⚠️https://your-ai-service.railway.app

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=⚠️your-email@gmail.com
EMAIL_PASSWORD=⚠️your-gmail-app-password
EMAIL_FROM=Legal AI <⚠️your-email@gmail.com>
EMAIL_USE_TLS=true

# CORS (Vercel domains - both deployment and custom domain)
CORS_ORIGINS=https://comp-30022-xi.vercel.app,https://comp-30022-keyldn81b-adams-projects-cf8e0da9.vercel.app
CORS_CREDENTIALS=true

# File Uploads
UPLOAD_FOLDER=/app/uploads
MAX_UPLOAD_SIZE_MB=10

# Logging
LOG_LEVEL=INFO
```

### 🔑 How to Generate Production Secrets:

```bash
# Run these commands locally, use different outputs:
python -c "import secrets; print(secrets.token_hex(32))"  # For FLASK_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"  # For JWT_SECRET_KEY
```

**⚠️ Important**: Use DIFFERENT secrets than your development environment!

---

## 🤖 Railway - AI Service

**Platform**: Railway Dashboard → AI Service → Variables

### Option A: Using OpenAI (Recommended for Production)

```bash
# Service Configuration
PORT=8000
ENVIRONMENT=production
PYTHONUNBUFFERED=1

# OpenAI Configuration
OPENAI_API_KEY=⚠️sk-proj-your-openai-api-key

# Model Configuration
MODEL_NAME=gpt-4-turbo-preview
EMBEDDING_MODEL=text-embedding-3-small
MAX_TOKENS=4096
TEMPERATURE=0.7
TOP_P=0.9

# Vector Database - ChromaDB (local, simpler for Railway)
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

# Query Configuration
MAX_RESULTS=5

# Rate Limiting (ENABLED for production)
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# Logging
LOG_LEVEL=INFO
```

### Option B: Using Hugging Face + Pinecone (Current Setup)

```bash
# Service Configuration
PORT=8000
ENVIRONMENT=production
PYTHONUNBUFFERED=1

# Hugging Face (Use your token from ai-service/.env)
HF_TOKEN=your-huggingface-token-here

# Pinecone (Use your API key from ai-service/.env)
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_INDEX_NAME=legalai

# Model Configuration
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Vector Database
VECTOR_DB_TYPE=pinecone
EMBEDDING_DIMENSION=384

# Document Processing
DOCUMENTS_PATH=/app/data/documents
MAX_DOCUMENT_SIZE_MB=10
ALLOWED_EXTENSIONS=pdf,docx,txt
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# Query Configuration
MAX_RESULTS=5
MAX_TOKENS=512
TEMPERATURE=0.7
TOP_P=0.9

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# Logging
LOG_LEVEL=INFO
```

**💡 Recommendation**: Start with Option B (Hugging Face), migrate to Option A (OpenAI) if quality needs improvement.

---

## ☁️ Vercel - Frontend

**Platform**: Vercel Dashboard → Project → Settings → Environment Variables

```bash
# API Endpoints (update after Railway deployments)
NEXT_PUBLIC_API_URL=⚠️https://your-backend.railway.app

# Note: Frontend should call backend, not AI service directly
# Backend handles communication with AI service

# Telemetry
NEXT_TELEMETRY_DISABLED=1

# Analytics (optional)
# NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**⚠️ Important**: Update `NEXT_PUBLIC_API_URL` with your actual Railway backend domain after deployment.

---

## 🔐 GitHub Secrets

**Platform**: GitHub → Settings → Secrets and variables → Actions → New repository secret

### Vercel Secrets

| Secret Name | How to Get It | Value |
|-------------|---------------|-------|
| `VERCEL_TOKEN` | [Vercel Account → Tokens](https://vercel.com/account/tokens) | Click "Create Token" |
| `VERCEL_ORG_ID` | Run `vercel link` in frontend folder | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Run `vercel link` in frontend folder | From `.vercel/project.json` |

**Commands to get Vercel IDs**:
```bash
cd frontend
vercel link  # Follow prompts, select your project
cat .vercel/project.json
# Copy "orgId" and "projectId" from output
```

### Railway Secrets

| Secret Name | How to Get It | Value |
|-------------|---------------|-------|
| `RAILWAY_TOKEN` | [Railway Account → Tokens](https://railway.app/account/tokens) | Click "Create Token" |
| `RAILWAY_BACKEND_SERVICE_ID` | Railway Backend Service URL | Last part of URL: `railway.app/project/xxx/service/SERVICE_ID` |
| `RAILWAY_AI_SERVICE_ID` | Railway AI Service URL | Last part of URL: `railway.app/project/xxx/service/SERVICE_ID` |

**How to find Service IDs**:
1. Go to Railway dashboard
2. Click on Backend service
3. Look at URL: `https://railway.app/project/abc123/service/def456`
4. Copy `def456` - that's your `RAILWAY_BACKEND_SERVICE_ID`
5. Repeat for AI Service

---

## 📋 Deployment Checklist

### Step 1: MongoDB Atlas ✅
- [x] Cluster created
- [x] Connection string obtained
- [ ] Database `legal_ai` created
- [ ] Collections created (queries, form_templates, analytics, users)
- [ ] Network access set to `0.0.0.0/0`

### Step 2: Railway Backend
- [ ] Create new service from GitHub
- [ ] Set root directory to `/backend`
- [ ] Set Dockerfile path to `Dockerfile.prod`
- [ ] Copy all backend environment variables
- [ ] Generate NEW production secrets
- [ ] Add Gmail credentials
- [ ] Deploy service
- [ ] Copy generated Railway domain
- [ ] Test: `curl https://your-backend.railway.app/health`

### Step 3: Railway AI Service
- [ ] Create new service from same GitHub repo
- [ ] Set root directory to `/ai-service`
- [ ] Set Dockerfile path to `Dockerfile.prod`
- [ ] Choose Option A (OpenAI) or Option B (Hugging Face)
- [ ] Copy all AI service environment variables
- [ ] Deploy service
- [ ] Copy generated Railway domain
- [ ] Update Backend's `AI_SERVICE_URL` with this domain
- [ ] Redeploy backend
- [ ] Test: `curl https://your-ai-service.railway.app/health`

### Step 4: Vercel Frontend
- [ ] Import project from GitHub
- [ ] Set root directory to `frontend`
- [ ] Add environment variables
- [ ] Update `NEXT_PUBLIC_API_URL` with Railway backend domain
- [ ] Deploy
- [ ] Copy Vercel production URL
- [ ] Update Backend's `CORS_ORIGINS` with this URL
- [ ] Redeploy backend
- [ ] Test: Open Vercel URL in browser

### Step 5: GitHub Secrets
- [ ] Get Vercel token
- [ ] Run `vercel link` to get org/project IDs
- [ ] Get Railway token
- [ ] Get Railway service IDs
- [ ] Add all 6 secrets to GitHub
- [ ] Test: Push to `main` branch, watch Actions

### Step 6: Verify Everything
- [ ] Frontend loads in browser
- [ ] Can submit a query
- [ ] AI responds to query
- [ ] Data saved in MongoDB Atlas
- [ ] Email notifications work (if configured)
- [ ] GitHub Actions CD pipeline passes

---

## 🔄 Update Sequence (Important!)

Because services depend on each other, deploy in this order:

1. **Deploy AI Service first** → Get URL
2. **Update Backend** with AI Service URL → Deploy
3. **Deploy Frontend** → Get URL
4. **Update Backend** with Frontend URL (CORS) → Redeploy

This avoids circular dependencies!

---

## 🧪 Testing URLs

After deployment, test these endpoints:

```bash
# Backend Health
curl https://your-backend.railway.app/health
# Should return: {"status": "healthy"}

# AI Service Health
curl https://your-ai-service.railway.app/health
# Should return health status

# Frontend
open https://your-frontend.vercel.app
# Should load the application
```

---

## 💰 Cost Estimate

With these settings:

- **MongoDB Atlas**: M0 Free ($0/month)
- **Railway Backend**: Hobby Plan ($5-10/month)
- **Railway AI Service**: Hobby Plan ($10-15/month)
- **Vercel**: Hobby Free or Pro ($0-20/month)
- **OpenAI API**: ~$5-20/month depending on usage
- **Hugging Face**: Free
- **Pinecone**: Free tier (up to 1M vectors)

**Total**: $20-65/month depending on choices

---

## 🆘 Quick Troubleshooting

**Railway deployment fails**:
- Check Dockerfile.prod exists in service directory
- Verify root directory is set correctly
- Check build logs for errors

**Backend can't connect to MongoDB**:
- Verify connection string is correct
- Check MongoDB Atlas network access allows `0.0.0.0/0`
- Ensure password doesn't have special characters that need URL encoding

**CORS errors in browser**:
- Make sure `CORS_ORIGINS` in backend includes your Vercel domain
- Must include `https://` prefix
- Redeploy backend after updating CORS

**AI Service times out**:
- Check OpenAI API key is valid and has credits
- For Hugging Face, check token is valid
- Verify RATE_LIMIT settings aren't too restrictive

---

## 📚 Next Steps

1. **Now**: Set up Railway services with these env vars
2. **After Railway**: Update Vercel with backend URL
3. **After Vercel**: Update backend CORS with frontend URL
4. **Finally**: Configure GitHub secrets and test CI/CD

Full guides available at:
- [Deployment Quick Start](docs/DEPLOYMENT-QUICKSTART.md)
- [Full Deployment Guide](docs/06-deployment-guide.md)
- [Environment Variables Reference](docs/07-environment-variables.md)

---

**Ready to deploy?** Start with Step 2 (Railway Backend) in the checklist above! 🚀
