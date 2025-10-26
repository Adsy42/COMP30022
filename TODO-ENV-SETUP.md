# 🔧 Environment Variables - What You Need to Update

I've updated your existing `.env` files with all the missing variables needed for deployment. Here's what you still need to configure:

---

## ✅ Already Configured (No Action Needed)

Your existing setup already has:
- ✅ **AI Service**: Hugging Face token + Pinecone API key (working!)
- ✅ **Frontend**: API URLs and feature flags configured
- ✅ **Backend**: Basic structure in place

---

## ⚠️ Action Required: Update These Values

### 1. Backend `.env` - Need to Update 3 Things

**File**: `backend/.env`

```bash
# TODO: Generate these secret keys (run the command below)
FLASK_SECRET_KEY=your-secret-key-change-in-production  # ⚠️ CHANGE THIS
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production  # ⚠️ CHANGE THIS

# TODO: Add your Gmail credentials
EMAIL_USER=your-email@gmail.com  # ⚠️ CHANGE THIS
EMAIL_PASSWORD=your-app-password  # ⚠️ CHANGE THIS
EMAIL_FROM=Legal AI <your-email@gmail.com>  # ⚠️ CHANGE THIS
```

**How to fix:**

#### Generate Secret Keys:
```bash
# Run this twice, use different values for each
python -c "import secrets; print(secrets.token_hex(32))"

# Copy output and paste into FLASK_SECRET_KEY
# Run again and paste into JWT_SECRET_KEY
```

#### Get Gmail App Password:
1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail
3. If you see "App passwords unavailable" - you need to enable 2-Factor Authentication first
4. Create app password named "Legal AI"
5. Copy the 16-character password
6. Paste into `EMAIL_PASSWORD` in backend/.env

---

### 2. AI Service `.env` - Optional: Add OpenAI Key

**File**: `ai-service/.env`

**Current Status**: ✅ You're using Hugging Face + Pinecone (free alternatives)

**Optional**: For production, you may want to use OpenAI for better quality:

```bash
# Currently commented out - uncomment and add key if you want to use OpenAI
# OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

**How to get OpenAI key** (if needed):
1. Go to https://platform.openai.com/api-keys
2. Sign up / log in
3. Click "Create new secret key"
4. Name it "Legal AI"
5. Copy the key (starts with `sk-proj-`)
6. Add $5-10 credit at https://platform.openai.com/account/billing
7. Uncomment and paste in ai-service/.env

**Note**: Your current setup with Hugging Face works fine for development!

---

### 3. Frontend `.env.local` - Already Good!

**File**: `frontend/.env.local`

✅ No changes needed - already configured correctly!

---

## 🚀 For Production Deployment (Later)

When you're ready to deploy, you'll need these additional variables:

### MongoDB Atlas Connection String

Replace in `backend/.env` production:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legal_ai
```

### Railway Backend Variables

Set these in Railway dashboard:
- Update `AI_SERVICE_URL` to Railway AI service URL
- Update `MONGODB_URI` to Atlas connection string
- Use new secret keys (not the same as dev!)
- Update `CORS_ORIGINS` to your Vercel URL

### Railway AI Service Variables

Set these in Railway dashboard:
- Add `OPENAI_API_KEY` (recommended for production)
- Keep your Pinecone credentials

### Vercel Frontend Variables

Set these in Vercel dashboard:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 📋 Quick Checklist

**For Local Development** (Do Now):

- [ ] Generate FLASK_SECRET_KEY (run python command above)
- [ ] Generate JWT_SECRET_KEY (run python command above)
- [ ] Update EMAIL_USER with your Gmail address
- [ ] Get Gmail app password from https://myaccount.google.com/apppasswords
- [ ] Update EMAIL_PASSWORD with app password
- [ ] Update EMAIL_FROM with your Gmail address
- [ ] Test: Run `make dev-up` to start services

**For Production Deployment** (Later):

- [ ] Sign up for MongoDB Atlas
- [ ] Get Atlas connection string
- [ ] Create Railway account and projects
- [ ] Set Railway environment variables
- [ ] Create Vercel account and project
- [ ] Set Vercel environment variables
- [ ] Configure GitHub secrets for CI/CD

---

## 🧪 Test Your Setup

After updating the backend .env file:

```bash
# Start all services
make dev-up

# Check logs
docker-compose logs backend
docker-compose logs ai-service
docker-compose logs frontend

# Test endpoints
curl http://localhost:5000/health  # Backend
curl http://localhost:8000/health  # AI Service
open http://localhost:3000          # Frontend
```

If everything works, you should see:
- ✅ All containers start without errors
- ✅ Backend responds with health status
- ✅ AI service responds with health status
- ✅ Frontend loads in browser

---

## 🆘 Troubleshooting

### "Invalid Gmail credentials"
- Make sure you've enabled 2-Factor Authentication on Gmail
- Use App Password, not your regular Gmail password
- App password should be 16 characters with no spaces

### "Flask secret key not set"
- Make sure you replaced the placeholder text
- Secret keys should be 64 characters long
- Generate using the Python command provided

### "Can't connect to database"
- For local dev, make sure Docker is running
- Run `docker-compose up mongo` to start MongoDB
- Connection string should be `mongodb://admin:password123@mongo:27017/...`

---

## 📚 More Info

- Full deployment guide: [docs/06-deployment-guide.md](docs/06-deployment-guide.md)
- Environment variables reference: [docs/07-environment-variables.md](docs/07-environment-variables.md)
- Quick deployment guide: [docs/DEPLOYMENT-QUICKSTART.md](docs/DEPLOYMENT-QUICKSTART.md)
- Complete setup guide: [ENVIRONMENT-SETUP-GUIDE.md](ENVIRONMENT-SETUP-GUIDE.md)

---

**Summary**: You mainly need to:
1. Generate 2 secret keys (2 commands)
2. Get Gmail app password (2 minutes)
3. Update 5 lines in backend/.env

That's it for local development! 🎉
