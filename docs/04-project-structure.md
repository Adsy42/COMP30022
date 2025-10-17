# 🏗️ Project Repository Structure

> **📍 You are here:** [Documentation Index](./README.md) → **Project Structure**
>
> **🔙 Back to:** [Development Guide](./03-development-guide.md) | [Technical Context](../CLAUDE.md)

## Complete Directory Layout

```
COMP30022/
│
├── frontend/                       # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                   # App router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Home page
│   │   │   ├── chat/              # Chat interface
│   │   │   ├── admin/             # Admin dashboard
│   │   │   │   ├── dashboard/
│   │   │   │   ├── form-config/
│   │   │   │   └── email-config/
│   │   │   └── api/               # API routes (if needed)
│   │   ├── components/
│   │   │   ├── ui/                # Reusable UI components
│   │   │   ├── chat/              # Chat-specific components
│   │   │   ├── forms/             # Form components
│   │   │   └── layout/            # Layout components
│   │   ├── lib/
│   │   │   ├── api.ts             # API client
│   │   │   ├── utils.ts           # Utility functions
│   │   │   └── constants.ts       # Constants
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── styles/                # Global styles
│   │   └── types/                 # TypeScript types
│   ├── public/                    # Static assets
│   ├── .env.local.example
│   ├── next.config.js
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── backend/                        # Flask Backend API
│   ├── app/
│   │   ├── __init__.py            # Flask app initialization
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── queries.py         # Query handling endpoints
│   │   │   ├── admin.py           # Admin endpoints
│   │   │   └── forms.py           # Form configuration endpoints
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── query.py           # Query model
│   │   │   └── form_template.py  # Form template model
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── email_service.py   # Email service
│   │   │   ├── servicenow.py      # ServiceNow integration
│   │   │   └── ai_client.py       # AI service client
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── validators.py      # Input validators
│   │   │   └── helpers.py         # Helper functions
│   │   └── config.py               # Configuration
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── run.py                      # Entry point
│
├── ai-service/                     # AI/LLM Microservice
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI app
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── chat.py            # Chat endpoints
│   │   │   └── embeddings.py      # Embedding endpoints
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── rag.py             # RAG implementation
│   │   │   ├── llm.py             # LLM wrapper
│   │   │   └── vector_store.py    # Vector database
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic models
│   │   └── config.py
│   ├── data/                       # Knowledge base data
│   │   └── documents/
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── docker/                         # Docker configurations
│   ├── nginx/
│   │   └── nginx.conf             # Nginx config (optional)
│   └── mongo/
│       └── init-mongo.js          # MongoDB initialization
│
├── docs/                           # Documentation
│   ├── setup.md                   # Development setup guide
│   ├── api.md                     # API documentation
│   ├── architecture.md            # Architecture overview
│   ├── deployment.md              # Deployment guide
│   └── testing.md                 # Testing guide
│
├── scripts/                        # Utility scripts
│   ├── seed_db.py                 # Database seeding
│   ├── backup.sh                  # Backup script
│   └── dev_setup.sh              # Development setup script
│
├── .github/                       # GitHub configurations
│   └── workflows/
│       └── ci.yml                 # CI/CD pipeline
│
├── docker-compose.yml              # Docker Compose configuration
├── docker-compose.dev.yml          # Development overrides
├── Makefile                        # Development convenience commands
├── .gitignore                      # Git ignore rules
├── .env.example                    # Environment variables template
├── CLAUDE.md                       # Project context and instructions
├── DEVELOPMENT.md                  # Development guide
├── README.md                       # Project README
└── PROJECT_STRUCTURE.md           # This file

```

## Service Ports

- **Frontend (Next.js)**: 3000
- **Backend (Flask)**: 5000
- **AI Service (FastAPI)**: 8000
- **MongoDB**: 27017
- **Redis (if needed)**: 6379

## Key Design Decisions

### Frontend (Next.js)

- Using App Router for modern Next.js patterns
- TypeScript for type safety
- Tailwind CSS for styling (recommended)
- Component-based architecture

### Backend (Flask)

- RESTful API design
- Service layer pattern for business logic
- MongoDB integration via PyMongo

### AI Service

- FastAPI for high performance
- Separate microservice for scalability
- RAG implementation for knowledge retrieval
- Vector database for embeddings

### Database (MongoDB)

- Document-based storage for flexibility
- Collections: queries, form_templates, analytics
- Indexing for performance

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

### Backend (.env)

```
FLASK_APP=run.py
FLASK_ENV=development
MONGODB_URI=mongodb://mongo:27017/legal_ai
AI_SERVICE_URL=http://ai-service:8000
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
```

### AI Service (.env)

```
OPENAI_API_KEY=your-api-key
VECTOR_DB_PATH=./data/vector_db
MODEL_NAME=gpt-3.5-turbo
EMBEDDING_MODEL=text-embedding-ada-002
```

## Docker Compose Services

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongo
      - ai-service

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
```
