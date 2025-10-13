# 🚀 Quick Start Guide - Backend Development

## Prerequisites
- Docker and Docker Compose installed
- No local Python needed - fully containerized!

## Step 1: Start the Services

```bash
# Navigate to project root
cd COMP30022

# Start all services (MongoDB, Backend, Frontend, AI Service)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or using make
make dev-up
```

## Step 2: Initialize the Database

Wait for services to start, then seed the database:

```bash
# In a new terminal
docker-compose exec backend python seed_db.py
```

You should see:
```
Seeding database...
Creating admin user...
Admin user created (username: admin, password: admin123)
Seeding templates...
Common template created/updated
Simple template created/updated
Complex template created/updated
Default escalation email set

Database seeding completed successfully!
```

## Step 3: Test the Backend

### Health Check
```bash
curl http://localhost:5000/health
```

Expected: `{"status":"healthy"}`

### Login (Get JWT Token)
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected: `{"success":true,"token":"eyJ0eXAiOiJKV1Q..."}`

Save the token for authenticated requests!

### Get Templates (Public)
```bash
curl http://localhost:5000/templates?template=common
```

Expected: Array of questions

### Test Complete Chat Flow

```bash
# 1. Create a chat session
CHAT_ID=$(curl -X POST http://localhost:5000/chats -s | jq -r '.chat_id')
echo "Chat ID: $CHAT_ID"

# 2. Submit common answers
curl -X POST "http://localhost:5000/chats/$CHAT_ID/answers" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "common",
    "answers": [
      {"q_id": "q_name", "ans": "John Doe"},
      {"q_id": "q_role", "ans": "Researcher"}
    ]
  }'

# 3. Submit simple template answers
curl -X POST "http://localhost:5000/chats/$CHAT_ID/answers" \
  -H "Content-Type: application/json" \
  -d '{
    "template": "simple",
    "answers": [
      {"q_id": "q_project_name", "ans": "AI Research Project"},
      {"q_id": "q_grant_type", "ans": "Collaboration Agreement"}
    ]
  }'

# 4. Finalize the chat
curl -X POST "http://localhost:5000/chats/$CHAT_ID/finalize"
```

### Test File Upload

```bash
# Create a test file
echo "Test document content" > test.txt

# Upload it (replace $CHAT_ID with actual chat_id)
curl -X POST http://localhost:5000/uploads \
  -F "chat_id=$CHAT_ID" \
  -F "file=@test.txt"
```

### Test Analytics (Requires JWT)

```bash
# Replace YOUR_TOKEN with token from login
TOKEN="YOUR_JWT_TOKEN_HERE"

# Get KPIs
curl -X GET "http://localhost:5000/kpis?start_time=01/01/2025&end_time=31/12/2025" \
  -H "Authorization: Bearer $TOKEN"

# Get choice analytics
curl -X POST http://localhost:5000/analytics/choice \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "start_time": "01/01/2025",
    "end_time": "31/12/2025",
    "template": "common"
  }'
```

## Step 4: View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

## Step 5: Access MongoDB

```bash
# Connect to MongoDB shell
docker-compose exec mongo mongosh -u admin -p password123

# List databases
show dbs

# Use legal_ai database
use legal_ai

# Show collections
show collections

# Query chats
db.chats.find().pretty()

# Query templates
db.templates.find().pretty()

# Query users
db.users.find().pretty()
```

## Step 6: Run Tests

```bash
# Run all backend tests
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov=app

# Run specific test
docker-compose exec backend pytest tests/test_routes.py -v
```

## Common Development Tasks

### Format Code
```bash
docker-compose exec backend black app tests
```

### Lint Code
```bash
docker-compose exec backend ruff check app tests

# Auto-fix
docker-compose exec backend ruff check --fix app tests
```

### Restart Backend Only
```bash
docker-compose restart backend
```

### Rebuild Backend Container
```bash
docker-compose build backend
docker-compose up -d backend
```

### View Database from GUI

Install MongoDB Compass and connect to:
```
mongodb://admin:password123@localhost:27017/?authSource=admin
```

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Rebuild
docker-compose build --no-cache backend
docker-compose up backend
```

### MongoDB connection issues
```bash
# Verify MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongo

# Restart MongoDB
docker-compose restart mongo
```

### Port already in use
```bash
# Stop all containers
docker-compose down

# Check what's using port 5000
# Windows PowerShell:
netstat -ano | findstr :5000

# Kill the process using the PID from above
taskkill /PID <PID> /F
```

### Reset Everything
```bash
# Stop and remove all containers, volumes, and networks
docker-compose down -v

# Rebuild
docker-compose build

# Start fresh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Re-seed database
docker-compose exec backend python seed_db.py
```

## API Endpoints Reference

### Public Endpoints
- `GET /` - API info
- `GET /health` - Health check
- `GET /templates?template=<type>` - Get template questions
- `POST /chats` - Create chat session
- `POST /chats/{id}/answers` - Submit answers
- `POST /chats/{id}/finalize` - Finalize chat
- `POST /uploads` - Upload file
- `POST /escalations` - Escalate query
- `POST /login` - Admin login

### Protected Endpoints (Require JWT)
- `GET /kpis` - Get KPI metrics
- `POST /analytics/choice` - Get choice analytics
- `GET /analytics/choice-export` - Export analytics Excel
- `PUT /config/email-recipient` - Update escalation email
- `POST /templates/save` - Save template

## Environment Variables

Located in `backend/.env.example`:
- `FLASK_SECRET_KEY` - Flask secret key
- `JWT_SECRET_KEY` - JWT signing key
- `MONGODB_URI` - MongoDB connection
- `AI_SERVICE_URL` - AI service URL
- `EMAIL_USER` / `EMAIL_PASSWORD` - SMTP settings

## Default Credentials

**⚠️ For Development Only!**
- Username: `admin`
- Password: `admin123`

**Change these in production!**

## File Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app
│   ├── config.py            # Configuration
│   ├── routes.py            # Main routes
│   ├── api/                 # API endpoints
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   └── utils/               # Utilities
├── tests/                   # Tests
├── seed_db.py              # Database seeding
├── run.py                   # Entry point
└── requirements.txt         # Dependencies
```

## Next Steps

1. ✅ Backend running and tested
2. 🔄 Implement AI service endpoints
3. 🔄 Connect frontend to backend API
4. 🔄 End-to-end testing
5. 🔄 Production deployment

## Need Help?

- Check `backend/README.md` for detailed documentation
- See `api-spec.yaml` for API specification
- Read `BACKEND_IMPLEMENTATION.md` for implementation details
- Check logs: `docker-compose logs -f backend`

---

Happy coding! 🚀
