# Deployment Quick Start Guide

> **TL;DR**: Get your Legal AI System deployed to production in under 30 minutes!

For detailed instructions, see the [Full Deployment Guide](./06-deployment-guide.md).

## Prerequisites Checklist

- [ ] GitHub account with repository access
- [ ] Vercel account (free tier works)
- [ ] Railway account (hobby plan recommended)
- [ ] MongoDB Atlas account (M0 free tier works)
- [ ] OpenAI API key

## Step 1: MongoDB Atlas (5 minutes)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a **M0 Free Cluster** in Sydney region
3. Create database user: `legal_ai_user` with a strong password
4. Network Access: Allow `0.0.0.0/0` (all IPs)
5. Get connection string from "Connect" → "Connect your application"
6. Save this format:
   ```
   mongodb+srv://legal_ai_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/legal_ai?retryWrites=true&w=majority
   ```

## Step 2: Railway Backend (5 minutes)

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `COMP30022` repository
4. Service settings:
   - Name: `legal-ai-backend`
   - Root Directory: `/backend`
   - Dockerfile Path: `Dockerfile.prod`

5. Add environment variables (Variables tab):
   ```bash
   FLASK_ENV=production
   FLASK_SECRET_KEY=<generate-random-64-char-string>
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   AI_SERVICE_URL=https://your-ai-service.railway.app  # Update after step 3
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

6. Generate Flask secret key:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

7. Deploy → Settings → Networking → Generate Domain
8. Copy the domain: `legal-ai-backend.railway.app`

## Step 3: Railway AI Service (5 minutes)

1. In same Railway project: "New Service" → "GitHub Repo"
2. Select `COMP30022` repository
3. Service settings:
   - Name: `legal-ai-ai-service`
   - Root Directory: `/ai-service`
   - Dockerfile Path: `Dockerfile.prod`

4. Add environment variables:
   ```bash
   PORT=8000
   ENVIRONMENT=production
   OPENAI_API_KEY=sk-proj-your-api-key-here
   MODEL_NAME=gpt-4-turbo-preview
   EMBEDDING_MODEL=text-embedding-3-small
   ```

5. Deploy → Generate Domain
6. Copy domain: `legal-ai-ai-service.railway.app`
7. **Go back to backend service** → Update `AI_SERVICE_URL` variable
8. Redeploy backend service

## Step 4: Vercel Frontend (5 minutes)

1. Go to [Vercel](https://vercel.com/)
2. "Add New..." → "Project" → Import your repository
3. Project settings:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`

4. Environment Variables:
   ```bash
   NEXT_PUBLIC_API_URL=https://legal-ai-backend.railway.app
   NEXT_PUBLIC_AI_SERVICE_URL=https://legal-ai-ai-service.railway.app
   NEXT_TELEMETRY_DISABLED=1
   ```

5. Click "Deploy"
6. Copy your production URL: `your-project.vercel.app`

## Step 5: GitHub Secrets for CD (5 minutes)

### Get Vercel Credentials

1. Vercel → [Account Settings → Tokens](https://vercel.com/account/tokens) → Create Token
2. In your `frontend` directory:
   ```bash
   cd frontend
   vercel link  # Follow prompts
   cat .vercel/project.json  # Note the projectId and orgId
   ```

### Get Railway Credentials

1. Railway → [Account Settings → Tokens](https://railway.app/account/tokens) → Create Token
2. Railway service IDs are in the URL:
   - Format: `railway.app/project/<project-id>/service/<service-id>`
   - Get both backend and AI service IDs

### Set GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions

Create these secrets:

```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<from-project.json>
VERCEL_PROJECT_ID=<from-project.json>

RAILWAY_TOKEN=<your-railway-token>
RAILWAY_BACKEND_SERVICE_ID=<from-backend-service-url>
RAILWAY_AI_SERVICE_ID=<from-ai-service-url>
```

## Step 6: Test Deployment (5 minutes)

### Push to Main Branch

```bash
git checkout main
git merge develop
git push origin main
```

### Watch GitHub Actions

1. Go to "Actions" tab in GitHub
2. Watch the CD pipeline run
3. All jobs should pass and turn green

### Test Your Services

**Frontend:**
```bash
curl https://your-project.vercel.app
```
Should return HTML page.

**Backend Health:**
```bash
curl https://legal-ai-backend.railway.app/health
```
Should return `{"status": "healthy"}`

**AI Service Health:**
```bash
curl https://legal-ai-ai-service.railway.app/health
```
Should return health status.

### Test Full Stack

1. Open frontend URL in browser
2. Try submitting a query
3. Check if AI responds
4. Verify data is saved to MongoDB Atlas

## Verify Everything Works

Go through this checklist:

- [ ] Frontend loads in browser
- [ ] Backend health endpoint returns 200
- [ ] AI service health endpoint returns 200
- [ ] Can submit a query through the UI
- [ ] Query gets processed and returns a response
- [ ] Data appears in MongoDB Atlas database
- [ ] GitHub Actions CD pipeline passes
- [ ] All three services are running in Railway/Vercel dashboards

## Common Issues & Quick Fixes

### Backend can't connect to MongoDB
- Check MongoDB Atlas network access allows `0.0.0.0/0`
- Verify connection string format is correct
- Ensure password doesn't contain special characters that need encoding

### AI Service health check fails
- Verify OpenAI API key is correct and has credits
- Check Railway logs for startup errors
- Ensure PORT environment variable is set to 8000

### Frontend can't reach backend
- Verify `NEXT_PUBLIC_API_URL` points to Railway backend domain
- Check CORS is enabled on backend
- Ensure backend service is running

### GitHub Actions deployment fails
- Verify all secrets are set correctly
- Check service IDs match your Railway services
- Ensure Vercel token has correct permissions

## Next Steps

1. **Set up monitoring**: Configure Railway alerts and Vercel analytics
2. **Custom domain**: Add your own domain in Vercel settings
3. **Staging environment**: Create staging Railway services for testing
4. **Backup strategy**: Schedule MongoDB Atlas backups
5. **Security audit**: Review and rotate secrets regularly

## Production Readiness Checklist

Before going live:

- [ ] All secrets are strong and unique
- [ ] MongoDB backup is configured
- [ ] Error monitoring is set up (Sentry recommended)
- [ ] Rate limiting is enabled on AI service
- [ ] CORS origins are restricted to production domains
- [ ] SSL certificates are valid
- [ ] Health checks are responding
- [ ] Load testing completed
- [ ] Incident response plan documented

## Cost Estimates

- **MongoDB Atlas M0**: Free (512MB, good for 1000+ queries)
- **Railway Hobby**: $20/month (2 services, includes credits)
- **Vercel Pro**: $20/month (recommended for production)
- **OpenAI API**: Pay per token (~$0.50-5/day depending on usage)

**Total**: ~$40-60/month for production-ready deployment

## Support Resources

- [Full Deployment Guide](./06-deployment-guide.md) - Detailed instructions
- [Environment Variables Reference](./07-environment-variables.md) - Complete env var docs
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

## Troubleshooting Help

If you get stuck:

1. Check service logs:
   - Railway: Dashboard → Service → Deployments → View Logs
   - Vercel: Dashboard → Project → Deployments → View Logs
   - MongoDB: Atlas → Metrics

2. Review environment variables - most issues are misconfiguration

3. Test each service independently before testing integration

4. Verify network connectivity between services

---

**Congratulations!** You now have a production-ready Legal AI system deployed! 🎉

Time to push to main and watch your CD pipeline deploy automatically on every commit.
