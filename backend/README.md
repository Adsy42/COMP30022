# Backend API - Legal AI Query & Referral System

Flask-based REST API server implementing the API specification for the Legal AI Query & Referral System.

## 📋 Overview

This backend service provides:
- **Chat Session Management**: Create and manage chat sessions for user queries
- **Template Management**: Dynamic form templates for common, simple, and complex queries
- **File Uploads**: Handle document attachments linked to chat sessions
- **Authentication**: JWT-based admin authentication
- **Analytics**: KPIs and choice question analytics with Excel export
- **Escalation**: Email notifications for complex queries to legal team
- **AI Integration**: Communication with AI microservice for query analysis

## 🏗️ Architecture

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── config.py            # Configuration settings
│   ├── routes.py            # Main routes (health check)
│   ├── api/                 # API endpoint blueprints
│   │   ├── admin.py         # Authentication endpoints
│   │   ├── analytics.py     # Analytics and KPIs
│   │   ├── chats.py         # Chat session endpoints
│   │   ├── config.py        # Configuration endpoints
│   │   ├── escalations.py   # Escalation management
│   │   ├── templates.py     # Template endpoints
│   │   └── uploads.py       # File upload endpoints
│   ├── models/              # Database models
│   │   ├── chat.py          # Chat session model
│   │   ├── config.py        # App configuration model
│   │   ├── template.py      # Template model
│   │   └── user.py          # User model
│   ├── services/            # Business logic services
│   │   ├── ai_client.py     # AI service client
│   │   └── email_service.py # Email service
│   └── utils/               # Utility functions
│       ├── auth.py          # Auth decorators
│       ├── helpers.py       # Helper functions
│       └── validators.py    # Input validators
├── seeds/                   # Database seeding (organized by entity)
│   ├── seed_users.py        # User seeding
│   ├── seed_templates.py    # Template seeding
│   ├── seed_config.py       # Config seeding
│   ├── seed_form_questions.py # Form questions seeding
│   ├── seed_analytics.py    # Analytics seeding
│   └── data_*.py           # Large data structures
├── tests/                   # Test suite
├── run.py                   # Application entry point
├── seed_db.py              # Main seeding script
└── requirements.txt         # Python dependencies
```

## 🚀 API Endpoints

### Public Endpoints

#### Templates
- `GET /templates?template=<type>` - Fetch questions by template type
  - Query params: `template` (common|simple|complex)

#### Chat Sessions
- `POST /chats` - Create a new chat session
  - Returns: `{"chat_id": "chat_xxxxx"}`

- `POST /chats/{chat_id}/answers` - Upsert answers for a chat
  - Body: `{"template": "...", "answers": [...], "attachments": [...]}`

- `POST /chats/{chat_id}/finalize` - Finalize chat and get AI response
  - Returns: `{"chat_id": "...", "status": "simple|complex", "ai_response": "..."}`

#### File Uploads
- `POST /uploads` - Upload file linked to chat
  - Form data: `chat_id`, `file`
  - Returns: `{"fileId": "...", "name": "...", "size": ..., "mime": "..."}`

#### Escalations
- `POST /escalations` - Mark query for escalation
  - Body: `{"chat_id": "...", "escalate": true/false, "reason": "..."}`

### Admin Endpoints (Requires JWT)

#### Authentication
- `POST /login` - Admin login
  - Body: `{"username": "...", "password": "..."}`
  - Returns: `{"success": true, "token": "..."}`

#### Analytics
- `GET /kpis?start_time=...&end_time=...` - Get KPI metrics
  - Returns: `{"total_queries": ..., "simple_queries": ..., "ai_resolved_queries": ...}`

- `POST /analytics/choice` - Get choice question analytics
  - Body: `{"start_time": "dd/MM/yyyy", "end_time": "dd/MM/yyyy", "template": "..."}`

- `GET /analytics/choice-export` - Export analytics as Excel
  - Query params: `start_time`, `end_time`, `template` (optional)

#### Configuration
- `PUT /config/email-recipient` - Update escalation email
  - Body: `{"email_address": "..."}`

- `POST /templates/save?template=<type>` - Save template questions
  - Body: Array of questions

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```bash
# Flask Configuration
FLASK_ENV=development
FLASK_SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key

# MongoDB
MONGODB_URI=mongodb://admin:password123@mongo:27017/legal_ai?authSource=admin
MONGO_DATABASE=legal_ai

# AI Service
AI_SERVICE_URL=http://ai-service:8000

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_USE_TLS=true

# CORS
CORS_ORIGINS=http://localhost:3000

# File Uploads
UPLOAD_FOLDER=/app/uploads
MAX_CONTENT_LENGTH=16777216  # 16MB in bytes
```

## 🗄️ Database Collections

### chats
Stores chat session data including answers and status.

```javascript
{
  "_id": ObjectId,
  "chat_id": "chat_xxxxx",
  "common_answers": [{q_id: "...", ans: "..."}],
  "template_type": "simple|complex",
  "template_answers": [{q_id: "...", ans: "..."}],
  "attachments": ["f_xxxxx"],
  "status": "pending|simple|complex",
  "ai_response": "...",
  "escalated": false,
  "escalation_reason": null,
  "created_at": ISODate,
  "finalized_at": ISODate
}
```

### templates
Stores form templates with questions.

```javascript
{
  "_id": ObjectId,
  "template_type": "common|simple|complex",
  "questions": [{id: "...", question: "...", type: "...", options: [...]}],
  "version": 1,
  "is_active": true,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### users
Admin users for authentication.

```javascript
{
  "_id": ObjectId,
  "username": "admin",
  "email": "admin@unimelb.edu.au",
  "password_hash": "...",
  "role": "admin",
  "is_active": true,
  "created_at": ISODate
}
```

### app_config
Application configuration key-value store.

```javascript
{
  "_id": ObjectId,
  "key": "escalation_email",
  "value": "ric-contracts@unimelb.edu.au",
  "description": "...",
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### uploads
File upload metadata.

```javascript
{
  "_id": ObjectId,
  "file_id": "f_xxxxx",
  "chat_id": "chat_xxxxx",
  "original_name": "document.pdf",
  "stored_name": "f_xxxxx.pdf",
  "file_path": "/app/uploads/f_xxxxx.pdf",
  "size": 12345,
  "mime_type": "application/pdf"
}
```

## 🧪 Development

### Database Initialization

The database is automatically initialized when you start the containers in development mode:

1. **MongoDB** creates the schema using `database/init-mongo.js`
2. **Backend** automatically seeds data on startup via `entrypoint.sh`

**What gets seeded:**
- Admin user (username: `admin`, password: `admin123`)
- Form templates (common, simple, complex)
- Application configuration

**Manual seeding (if needed):**

```bash
# Seed everything
docker-compose exec backend python seed_db.py

# Seed only essential data
docker-compose exec backend python seed_db.py --essential

# Seed specific categories
docker-compose exec backend python seed_db.py --users
docker-compose exec backend python seed_db.py --templates
```

**See [DATABASE_INIT.md](./DATABASE_INIT.md) for complete documentation** on initialization and seeding.

### Initialize Database

After starting MongoDB, run the seeding script to create initial data:

```bash
# From backend directory
docker-compose exec backend python seed_db.py

# Seed only essential data (users, templates, config)
docker-compose exec backend python seed_db.py --essential

# Seed only mock data (form questions, analytics)
docker-compose exec backend python seed_db.py --mock

# Seed specific categories
docker-compose exec backend python seed_db.py --users
docker-compose exec backend python seed_db.py --templates
```

This creates:
- Admin user (username: `admin`, password: `admin123`)
- Default templates (common, simple, complex)
- Default escalation email configuration
- Form questions (with `--questions` or `--mock`)
- Analytics data (with `--analytics` or `--mock`)

See [seeds/README.md](./seeds/README.md) for detailed documentation on the seeding system.

### Running Tests

```bash
# Run all tests
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov=app

# Run specific test file
docker-compose exec backend pytest tests/test_routes.py
```

### Code Formatting

```bash
# Format code with Black
docker-compose exec backend black app tests

# Lint with Ruff
docker-compose exec backend ruff check app tests

# Auto-fix with Ruff
docker-compose exec backend ruff check --fix app tests
```

## 🔐 Authentication Flow

1. Admin logs in via `POST /login` with username/password
2. Server validates credentials and returns JWT token
3. Client includes token in Authorization header: `Bearer <token>`
4. Protected endpoints verify token using `@token_required` decorator
5. Tokens expire after 24 hours (configurable)

## 📧 Email Notifications

The system sends email notifications when:
- A query is escalated via `POST /escalations` with `escalate: true`
- Email includes chat details, answers, and attached files

Email configuration requires:
- SMTP server credentials
- Recipient email (configurable via `/config/email-recipient`)

## 📊 Analytics

### KPIs
- **Total Queries**: All finalized chats in date range
- **Simple Queries**: Chats with status="simple"
- **AI Resolved**: Simple queries not escalated

### Choice Analytics
- Aggregates selection counts for single/multi-choice questions
- Can filter by template type and date range
- Exports to Excel with formatted sheets

## 🔄 AI Service Integration

The backend communicates with the AI microservice for:
- Query analysis and routing (simple vs complex)
- AI response generation for simple queries

Endpoint: `POST {AI_SERVICE_URL}/api/analyze`

Request:
```json
{
  "chat_id": "chat_xxxxx",
  "common_answers": [...],
  "template_type": "simple",
  "template_answers": [...],
  "attachments": [...]
}
```

Response:
```json
{
  "status": "simple|complex",
  "response": "AI-generated response text (optional)"
}
```

## 🛡️ Security Considerations

1. **JWT Tokens**: Change `JWT_SECRET_KEY` in production
2. **Password Hashing**: Uses Werkzeug's bcrypt implementation
3. **File Uploads**: Validates file types and size limits
4. **CORS**: Configure allowed origins via `CORS_ORIGINS`
5. **Input Validation**: Email format, date formats, template types
6. **Admin Password**: Change default `admin123` password immediately

## 📝 Notes

- All dates in API use `dd/MM/yyyy` format (e.g., "01/09/2025")
- File uploads limited to 16MB by default
- Allowed file types: pdf, doc, docx, txt, png, jpg, jpeg, xls, xlsx
- Chat IDs auto-generated with prefix `chat_`
- File IDs auto-generated with prefix `f_`

## 🐛 Debugging

View logs:
```bash
docker-compose logs -f backend
```

Connect to MongoDB:
```bash
docker-compose exec mongo mongosh -u admin -p password123
```

Python shell with app context:
```bash
docker-compose exec backend python
>>> from app import create_app
>>> app = create_app()
>>> with app.app_context():
...     # Your code here
```

## 📚 Related Documentation

- [API Specification](../api-spec.yaml)
- [Project Structure](../docs/04-project-structure.md)
- [Development Guide](../docs/03-development-guide.md)
