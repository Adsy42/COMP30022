# Deployment Guide

> **Back to:** [Documentation Index](./README.md) | [Development Guide](./03-development-guide.md)

## Overview

This guide covers deploying the Legal AI Query & Referral System to production using:

- **Frontend**: Vercel
- **Backend API**: Railway
- **AI Service**: Railway
- **Database**: MongoDB Atlas

## Architecture Diagram

```
┌─────────────────┐
│   Vercel CDN    │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
    ┌────▼─────┐   ┌───▼───────┐
    │ Railway  │   │  Railway  │
    │ Backend  │◄──┤AI Service │
    └────┬─────┘   └───────────┘
         │
    ┌────▼──────────┐
    │ MongoDB Atlas │
    │   (Database)  │
    └───────────────┘
```

## Prerequisites

Before deploying, ensure you have:

1. **Accounts Created**:
   - [Vercel Account](https://vercel.com/signup)
   - [Railway Account](https://railway.app/login)
   - [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register)

2. **CLI Tools Installed** (optional for manual deployments):
   - Vercel CLI: `npm install -g vercel`
   - Railway CLI: `npm install -g @railway/cli`

3. **Repository Access**:
   - GitHub repository with proper permissions
   - Admin access to create GitHub secrets

## Step 1: MongoDB Atlas Setup

### 1.1 Create a Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Build a Database"
3. Choose a plan:
   - **Development**: M0 Free Tier (512MB)
   - **Production**: M10 or higher (recommended)
4. Select region closest to your Railway deployment (Sydney recommended)
5. Click "Create Cluster"

### 1.2 Create Database User

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: `legal_ai_user`
5. Password: Generate secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Note: For production, restrict to Railway IP ranges if available
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Driver: Python" and "Version: 3.6 or later"
5. Copy the connection string, it should look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your credentials
7. Add database name: `mongodb+srv://legal_ai_user:password@cluster0.xxxxx.mongodb.net/legal_ai?retryWrites=true&w=majority`

### 1.5 Initialize Database

Create collections and indexes:

1. Go to "Database" → "Browse Collections"
2. Click "Add My Own Data"
3. Database Name: `legal_ai`
4. Collection Names:
   - `queries`
   - `form_templates`
   - `analytics`
   - `users`

## Step 2: Railway Backend Setup

### 2.1 Create Backend Service

1. Log in to [Railway](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your repository
5. Select your repository: `COMP30022`
6. Click "Add variables" later (we'll do this next)

### 2.2 Configure Backend Service

1. In your Railway project, click on the service
2. Go to "Settings" tab:
   - **Name**: `legal-ai-backend`
   - **Root Directory**: `/backend`
   - **Build Command**: (leave empty, uses Dockerfile)
   - **Start Command**: (leave empty, uses Dockerfile CMD)

3. Go to "Settings" → "Deploy":
   - **Dockerfile Path**: `Dockerfile.prod`
   - Enable "Watch Paths": `/backend/**`

### 2.3 Set Backend Environment Variables

Go to "Variables" tab and add:

```bash
# Flask Configuration
FLASK_ENV=production
FLASK_SECRET_KEY=<generate-secure-random-key>
PORT=5000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://legal_ai_user:password@cluster0.xxxxx.mongodb.net/legal_ai?retryWrites=true&w=majority

# AI Service URL (will update after AI service deployment)
AI_SERVICE_URL=https://your-ai-service.railway.app

# Email Configuration (Gmail example)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# ServiceNow Configuration (optional)
SERVICENOW_INSTANCE=your-instance.service-now.com
SERVICENOW_USERNAME=your-username
SERVICENOW_PASSWORD=your-password
```

### 2.4 Generate Flask Secret Key

Run in terminal:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2.5 Deploy Backend

1. Click "Deploy" in Railway dashboard
2. Wait for build to complete (check logs)
3. Once deployed, go to "Settings" → "Networking"
4. Click "Generate Domain"
5. Copy the domain (e.g., `legal-ai-backend.railway.app`)

## Step 3: Railway AI Service Setup

### 3.1 Create AI Service

1. In your Railway project, click "New Service"
2. Select "GitHub Repo"
3. Select the same repository
4. Configure service settings:
   - **Name**: `legal-ai-ai-service`
   - **Root Directory**: `/ai-service`
   - **Dockerfile Path**: `Dockerfile.prod`
   - Enable "Watch Paths": `/ai-service/**`

### 3.2 Set AI Service Environment Variables

Go to "Variables" tab and add:

```bash
# Service Configuration
PORT=8000
ENVIRONMENT=production

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Vector Database Configuration
VECTOR_DB_PATH=/app/data/vector_db

# Document Storage
DOCUMENTS_PATH=/app/data/documents

# Model Configuration (optional)
MODEL_NAME=gpt-4-turbo-preview
EMBEDDING_MODEL=text-embedding-3-small
MAX_TOKENS=4096
TEMPERATURE=0.7
```

### 3.3 Add Persistent Storage (Optional)

If you need persistent vector database storage:

1. Go to "Settings" → "Volumes"
2. Click "Add Volume"
3. Mount Path: `/app/data`
4. Size: 1GB (adjust as needed)

### 3.4 Deploy AI Service

1. Click "Deploy"
2. Wait for deployment to complete
3. Generate domain: `legal-ai-ai-service.railway.app`
4. Copy the URL

### 3.5 Update Backend Environment Variables

Go back to backend service variables and update:
```bash
AI_SERVICE_URL=https://legal-ai-ai-service.railway.app
```

Redeploy backend service.

## Step 4: Vercel Frontend Setup

### 4.1 Import Project to Vercel

1. Log in to [Vercel](https://vercel.com/)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm ci`

### 4.2 Set Frontend Environment Variables

In Vercel project settings → "Environment Variables":

```bash
# API Endpoints
NEXT_PUBLIC_API_URL=https://legal-ai-backend.railway.app
NEXT_PUBLIC_AI_SERVICE_URL=https://legal-ai-ai-service.railway.app

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Telemetry
NEXT_TELEMETRY_DISABLED=1
```

### 4.3 Configure Production Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain (e.g., `legal-ai.unimelb.edu.au`)
3. Follow DNS configuration instructions

### 4.4 Deploy Frontend

1. Click "Deploy"
2. Vercel will automatically build and deploy
3. Copy the production URL

## Step 5: GitHub Secrets Configuration

Set up GitHub secrets for automated CD pipeline:

1. Go to your GitHub repository
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret" and add:

```bash
# Vercel Secrets
VERCEL_TOKEN=<vercel-token>
VERCEL_ORG_ID=<vercel-org-id>
VERCEL_PROJECT_ID=<vercel-project-id>

# Railway Secrets
RAILWAY_TOKEN=<railway-token>
RAILWAY_BACKEND_SERVICE_ID=<backend-service-id>
RAILWAY_AI_SERVICE_ID=<ai-service-id>
```

### 5.1 Get Vercel Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name: "GitHub Actions CD"
4. Scope: Full Account
5. Copy the token

### 5.2 Get Vercel Project IDs

Run in your frontend directory:
```bash
cd frontend
vercel link
cat .vercel/project.json
```

### 5.3 Get Railway Token

1. Go to [Railway Account Settings](https://railway.app/account/tokens)
2. Click "Create New Token"
3. Name: "GitHub Actions CD"
4. Copy the token

### 5.4 Get Railway Service IDs

1. Go to your Railway project
2. Click on each service
3. Look in the URL: `railway.app/project/<project-id>/service/<service-id>`
4. Copy the service IDs

## Step 6: Enable GitHub Environments

1. Go to "Settings" → "Environments"
2. Create three environments:
   - `production-frontend`
   - `production-backend`
   - `production-ai-service`
3. For each environment:
   - Enable "Required reviewers" (optional)
   - Set "Deployment branches": `main` only

## Step 7: Test Deployment Pipeline

### 7.1 Trigger Deployment

1. Push to `main` branch:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

2. Go to "Actions" tab in GitHub
3. Watch the CD pipeline execute

### 7.2 Verify Deployments

Check each service:

**Frontend**:
```bash
curl https://your-frontend.vercel.app
```

**Backend**:
```bash
curl https://legal-ai-backend.railway.app/health
```

**AI Service**:
```bash
curl https://legal-ai-ai-service.railway.app/health
```

## Monitoring and Maintenance

### Railway Monitoring

1. **Logs**: View in Railway dashboard → Service → "Deployments" tab
2. **Metrics**: CPU, Memory, Network usage
3. **Alerts**: Configure in Railway settings

### Vercel Monitoring

1. **Analytics**: Vercel dashboard → "Analytics"
2. **Logs**: Real-time function logs
3. **Speed Insights**: Performance monitoring

### MongoDB Atlas Monitoring

1. **Metrics**: Atlas dashboard → "Metrics"
2. **Performance Advisor**: Optimization suggestions
3. **Alerts**: Configure in "Alerts" tab

## Rollback Procedures

### Frontend Rollback (Vercel)

1. Go to Vercel project → "Deployments"
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Backend/AI Service Rollback (Railway)

1. Go to Railway service → "Deployments"
2. Find previous deployment
3. Click "..." → "Redeploy"

Or via CLI:
```bash
railway rollback
```

### Database Rollback (MongoDB Atlas)

1. Restore from snapshot:
   - Go to "Backup" tab
   - Select snapshot
   - Click "Restore"

## Troubleshooting

### Common Issues

**Issue**: Build fails on Railway
- Check Dockerfile.prod exists
- Verify root directory is set correctly
- Check build logs for errors

**Issue**: Environment variables not working
- Ensure variables are set in Railway dashboard
- Restart the service after adding variables
- Check for typos in variable names

**Issue**: Services can't communicate
- Verify service URLs are correct
- Check Railway networking settings
- Ensure services are in the same project

**Issue**: Database connection fails
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Ensure database user has correct permissions

## Security Best Practices

1. **Rotate secrets regularly** (every 90 days)
2. **Use environment-specific secrets** (don't reuse between dev/prod)
3. **Enable Railway IP restrictions** when available
4. **Set up MongoDB Atlas IP whitelist** properly
5. **Use Vercel security headers** (configured in vercel.json)
6. **Enable HTTPS only** on all services
7. **Implement rate limiting** on API endpoints
8. **Regular security audits** of dependencies

## Cost Optimization

### Railway Costs
- **Free Tier**: $5/month credit
- **Hobby Plan**: $20/month (recommended for production)
- Monitor usage in Railway dashboard

### MongoDB Atlas Costs
- **M0 Free**: 512MB (development)
- **M10 Shared**: ~$57/month (production)
- Use MongoDB Atlas cost calculator

### Vercel Costs
- **Hobby**: Free (personal projects)
- **Pro**: $20/month per user (production recommended)

## Next Steps

1. Set up monitoring alerts
2. Configure backup schedules
3. Implement CI/CD improvements
4. Set up staging environment
5. Document incident response procedures

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
