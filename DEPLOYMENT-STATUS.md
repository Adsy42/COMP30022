# 🚀 Deployment Status & Configuration

**Last Updated**: Current
**Project**: Legal AI Query & Referral System

---

## ✅ Completed Deployments

### 1. Frontend - Vercel ✅

**Status**: DEPLOYED

**Production URL**: https://comp-30022-xi.vercel.app
**Deployment URL**: https://comp-30022-keyldn81b-adams-projects-cf8e0da9.vercel.app

**Current Environment Variables** (in Vercel):
```bash
NEXT_PUBLIC_API_URL=⚠️ UPDATE WITH RAILWAY BACKEND URL
NEXT_TELEMETRY_DISABLED=1
```

**Action Required**:
- [ ] Update `NEXT_PUBLIC_API_URL` with Railway backend URL (after backend deployment)

---

### 2. Database - MongoDB Atlas ✅

**Status**: CONFIGURED

**Connection String**:
```
mongodb+srv://Adsy42:Coolbro-13@cluster0.ismq8yq.mongodb.net/legal_ai?retryWrites=true&w=majority&appName=Cluster0
```

**Action Required**:
- [ ] Create database `legal_ai` in MongoDB Atlas dashboard
- [ ] Create collections: `queries`, `form_templates`, `analytics`, `users`

**How to do it**:
1. Go to https://cloud.mongodb.com/
2. Click "Browse Collections"
3. Click "Add My Own Data"
4. Database name: `legal_ai`
5. Collection name: `queries` (add others after)

---

## ⏳ Pending Deployments

### 3. Backend API - Railway ⏳

**Status**: NOT YET DEPLOYED

**Required Environment Variables** (copy to Railway dashboard):

```bash
# Flask Configuration
FLASK_ENV=production
FLASK_SECRET_KEY=⚠️GENERATE_NEW
JWT_SECRET_KEY=⚠️GENERATE_NEW
PORT=5000

# MongoDB Atlas (Ready!)
MONGODB_URI=mongodb+srv://Adsy42:Coolbro-13@cluster0.ismq8yq.mongodb.net/legal_ai?retryWrites=true&w=majority&appName=Cluster0
MONGO_DATABASE=legal_ai

# AI Service (Update after AI service deployment)
AI_SERVICE_URL=⚠️UPDATE_AFTER_AI_SERVICE_DEPLOYED

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=⚠️your-email@gmail.com
EMAIL_PASSWORD=⚠️your-gmail-app-password
EMAIL_FROM=Legal AI <⚠️your-email@gmail.com>
EMAIL_USE_TLS=true

# CORS (Both Vercel domains included)
CORS_ORIGINS=https://comp-30022-xi.vercel.app,https://comp-30022-keyldn81b-adams-projects-cf8e0da9.vercel.app
CORS_CREDENTIALS=true

# File Uploads
UPLOAD_FOLDER=/app/uploads
MAX_UPLOAD_SIZE_MB=10

# Logging
LOG_LEVEL=INFO
```

**Deployment Steps**:
1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `COMP30022` repository
4. Configure:
   - Service Name: `legal-ai-backend`
   - Root Directory: `/backend`
   - Dockerfile Path: `Dockerfile.prod`
   - Watch Paths: `/backend/**`
5. Go to Variables tab → Add all variables above
6. Click "Deploy"
7. Go to Settings → Networking → Generate Domain
8. Copy the Railway domain (e.g., `legal-ai-backend.railway.app`)

**After Deployment**:
- [ ] Copy Railway backend domain
- [ ] Update Vercel's `NEXT_PUBLIC_API_URL` with backend domain
- [ ] Update AI Service's `AI_SERVICE_URL` in backend (after AI service is deployed)

---

### 4. AI Service - Railway ⏳

**Status**: NOT YET DEPLOYED

**Recommended Configuration** (using your existing Hugging Face + Pinecone):

```bash
# Service Configuration
PORT=8000
ENVIRONMENT=production
PYTHONUNBUFFERED=1

# Hugging Face (Use your existing token from ai-service/.env)
HF_TOKEN=your-huggingface-token-from-env-file

# Pinecone (Use your existing API key from ai-service/.env)
PINECONE_API_KEY=your-pinecone-api-key-from-env-file
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

# Rate Limiting (ENABLED for production)
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60

# Logging
LOG_LEVEL=INFO
```

**Deployment Steps**:
1. In same Railway project, click "New Service"
2. Select "GitHub Repo" → Same repository
3. Configure:
   - Service Name: `legal-ai-ai-service`
   - Root Directory: `/ai-service`
   - Dockerfile Path: `Dockerfile.prod`
   - Watch Paths: `/ai-service/**`
4. Go to Variables tab → Add all variables above
5. Click "Deploy"
6. Go to Settings → Networking → Generate Domain
7. Copy the Railway domain (e.g., `legal-ai-ai-service.railway.app`)

**After Deployment**:
- [ ] Copy Railway AI service domain
- [ ] Go back to Backend service → Variables
- [ ] Update `AI_SERVICE_URL` with AI service domain
- [ ] Redeploy backend service

---

### 5. GitHub Actions CI/CD ⏳

**Status**: CONFIGURED (waiting for secrets)

**Required GitHub Secrets** (6 total):

| Secret Name | How to Get | Status |
|-------------|------------|--------|
| `VERCEL_TOKEN` | [Vercel Account → Tokens](https://vercel.com/account/tokens) | ⏳ |
| `VERCEL_ORG_ID` | Run `vercel link` in frontend folder | ⏳ |
| `VERCEL_PROJECT_ID` | Run `vercel link` in frontend folder | ⏳ |
| `RAILWAY_TOKEN` | [Railway Account → Tokens](https://railway.app/account/tokens) | ⏳ |
| `RAILWAY_BACKEND_SERVICE_ID` | Backend service URL | ⏳ |
| `RAILWAY_AI_SERVICE_ID` | AI service URL | ⏳ |

**Setup Steps**:

#### Get Vercel Secrets:
```bash
# 1. Get Vercel Token from: https://vercel.com/account/tokens

# 2. Get Project IDs
cd frontend
vercel link  # Follow prompts
cat .vercel/project.json  # Shows orgId and projectId
```

#### Get Railway Secrets:
```bash
# 1. Get Railway Token from: https://railway.app/account/tokens

# 2. Get Service IDs from Railway dashboard URLs:
# Backend: railway.app/project/xxx/service/BACKEND_ID
# AI Service: railway.app/project/xxx/service/AI_SERVICE_ID
```

#### Add to GitHub:
1. Go to: https://github.com/your-username/COMP30022/settings/secrets/actions
2. Click "New repository secret"
3. Add all 6 secrets
4. Test by pushing to `main` branch

---

## 📊 Deployment Progress

| Component | Status | URL | Notes |
|-----------|--------|-----|-------|
| **Frontend** | ✅ Deployed | https://comp-30022-xi.vercel.app | Need to update API URL |
| **Database** | ✅ Configured | MongoDB Atlas | Need to create collections |
| **Backend** | ⏳ Pending | - | Ready to deploy |
| **AI Service** | ⏳ Pending | - | Ready to deploy |
| **CI/CD** | ⏳ Pending | - | Need GitHub secrets |

**Overall Progress**: 40% Complete (2/5)

---

## 🎯 Deployment Order (IMPORTANT!)

Deploy in this specific order to avoid circular dependencies:

1. ✅ **Frontend** (Done) → Get Vercel URLs
2. ✅ **MongoDB Atlas** (Done) → Get connection string
3. ⏳ **AI Service** (Next) → Get Railway domain
4. ⏳ **Backend** (After AI) → Get Railway domain, update with AI URL
5. ⏳ **Update Frontend** → Add backend URL to Vercel env vars
6. ⏳ **GitHub Secrets** → Enable CI/CD

---

## 🔧 Quick Actions Needed

### Immediate (Can do now):

1. **Generate Production Secrets**:
```bash
python -c "import secrets; print(secrets.token_hex(32))"  # FLASK_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"  # JWT_SECRET_KEY
```

2. **Get Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Create app password for "Legal AI Production"
   - Copy the 16-character password

3. **Create MongoDB Collections**:
   - Go to https://cloud.mongodb.com/
   - Navigate to Browse Collections
   - Create database `legal_ai`
   - Add collections: `queries`, `form_templates`, `analytics`, `users`

### Next (Deploy Railway services):

4. **Deploy AI Service to Railway**:
   - Use configuration from section 4 above
   - Copy domain after deployment

5. **Deploy Backend to Railway**:
   - Use configuration from section 3 above
   - Update `AI_SERVICE_URL` with AI service domain from step 4
   - Copy domain after deployment

6. **Update Vercel Frontend**:
   - Add `NEXT_PUBLIC_API_URL` = backend domain from step 5
   - Redeploy frontend

### Final (Enable CI/CD):

7. **Configure GitHub Secrets**:
   - Get all 6 secrets as described in section 5
   - Add to GitHub repository settings
   - Test by pushing to `main` branch

---

## 🧪 Testing Checklist

After all deployments are complete, verify:

- [ ] Frontend loads: https://comp-30022-xi.vercel.app
- [ ] Backend health: `curl https://[backend].railway.app/health`
- [ ] AI service health: `curl https://[ai-service].railway.app/health`
- [ ] Submit a query through frontend
- [ ] Query gets AI response
- [ ] Data appears in MongoDB Atlas
- [ ] GitHub Actions runs on push to `main`
- [ ] No CORS errors in browser console

---

## 📚 Reference Documents

- [Production Env Vars](./PRODUCTION-ENV-VARS.md) - Copy-paste ready configurations
- [Deployment Quick Start](./docs/DEPLOYMENT-QUICKSTART.md) - 30-minute deployment guide
- [Full Deployment Guide](./docs/06-deployment-guide.md) - Comprehensive instructions
- [Environment Variables Reference](./docs/07-environment-variables.md) - Complete documentation
- [TODO Env Setup](./TODO-ENV-SETUP.md) - Local development setup

---

## 🆘 Support

**Deployment Issues?**
- Check [docs/06-deployment-guide.md](docs/06-deployment-guide.md) troubleshooting section
- Review Railway/Vercel logs in dashboards
- Verify all environment variables are set correctly

**Need Help?**
- Scrum Master: Bryan
- Backend Lead: Himank
- AI Lead: Yusuf
- Frontend Lead: Farah

---

**Next Step**: Deploy AI Service to Railway (Section 4) ⬆️
