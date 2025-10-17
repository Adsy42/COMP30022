# 🤖 CLAUDE.md - Technical Context and Instructions

> **📍 You are here:** [Documentation Index](./docs/README.md) → **Technical Context**
>
> **🔙 Back to:** [Development Guide](./docs/03-development-guide.md) | [Project Structure](./docs/04-project-structure.md)

## Project Overview

**Legal AI Query & Referral System** - A unified platform for University of Melbourne researchers to submit grants-related queries and receive AI-powered assistance or escalation to the legal team.

**Team Structure:**

- Product Owner: Adam
- Frontend Lead: Farah
- Backend Lead: Himank
- AI Lead: Yusuf
- Scrum Master: Bryan

## Tech Stack & Architecture

### Core Technologies

- **Frontend**: Next.js 14.0.0 with React 18, TypeScript, App Router
- **Backend**: Flask 3.0.0 with Python 3.11+
- **AI Service**: FastAPI with Python 3.11+ (microservice architecture)
- **Database**: MongoDB 7.0 with PyMongo
- **Containerization**: Docker & Docker Compose

### Service Architecture

The project follows a microservices architecture with 4 main services:

1. **Frontend** (Port 3000): Next.js React application
2. **Backend** (Port 5000): Flask REST API server
3. **AI Service** (Port 8000): FastAPI microservice for AI/LLM capabilities
4. **Database** (Port 27017): MongoDB instance

### Service Communication

- Frontend → Backend API (REST)
- Backend → AI Service (HTTP requests)
- Backend → MongoDB (PyMongo)
- All services communicate via Docker network: `legal-ai-network`

## Development Environment

### Prerequisites

- Docker & Docker Compose
- Make (optional, for convenience)

**No local Python/Node.js installations required** - everything runs in containers!

### Quick Start Commands

```bash
# Start all services in development mode
make dev-up
# or manually:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop all services
make dev-down

# Run all tests (containers must be running)
make test

# Format all code (containers must be running)
make format

# Lint all code (containers must be running)
make lint

# Build Docker images
make build

# Clean up artifacts
make clean
```

### Service URLs (Development)

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: localhost:27017

## Code Quality & Development Workflow

### Pre-commit Hooks

The project uses comprehensive pre-commit hooks configured in `.pre-commit-config.yaml`:

**Python Services (Backend & AI Service):**

- Black formatting
- Ruff linting with auto-fix
- Automated pytest execution

**Frontend:**

- Prettier formatting
- ESLint with auto-fix
- Jest tests (with --passWithNoTests flag)

**General:**

- Trailing whitespace removal
- End-of-file fixing
- YAML/JSON validation
- Merge conflict detection

### Testing Strategy

- **Backend**: pytest with Flask integration
- **AI Service**: pytest with async support (pytest-asyncio)
- **Frontend**: Jest with React Testing Library
- All tests run automatically in CI and pre-commit hooks

### Code Formatting

- **Python**: Black (line length: default 88 chars)
- **JavaScript/TypeScript**: Prettier
- **Linting**: Ruff for Python, ESLint for frontend

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

Triggers on: push/PR to `main` or `develop` branches

**Pipeline Jobs:**

1. **Frontend Tests**: Node.js 20, npm ci, format check, lint, type check, test, build
2. **Backend Tests**: Python 3.11, pip install, format check, ruff check, pytest
3. **AI Service Tests**: Python 3.11, pip install, format check, ruff check, pytest
4. **Docker Build Tests**: Validates docker-compose configuration

**Features:**

- Dependency caching for faster builds
- Parallel job execution
- Docker Compose validation

## Project Structure Patterns

### Frontend (Next.js App Router)

```
frontend/src/app/
├── layout.tsx          # Root layout
├── page.tsx           # Home page
├── chat/              # Chat interface pages
├── admin/             # Admin dashboard
│   ├── dashboard/
│   ├── form-config/
│   └── email-config/
└── api/               # API routes (if needed)
```

**Planned Structure:**

```
frontend/src/
├── components/
│   ├── ui/            # Reusable UI components
│   ├── chat/          # Chat-specific components
│   ├── forms/         # Form components
│   └── layout/        # Layout components
├── lib/
│   ├── api.ts         # API client
│   ├── utils.ts       # Utility functions
│   └── constants.ts   # Constants
├── hooks/             # Custom React hooks
├── styles/            # Global styles
└── types/             # TypeScript types
```

### Backend (Flask)

```
backend/app/
├── __init__.py        # Flask app initialization
├── routes.py          # Basic route handler (current)
├── api/               # Planned API endpoints
│   ├── queries.py     # Query handling
│   ├── admin.py       # Admin endpoints
│   └── forms.py       # Form configuration
├── models/            # Planned data models
├── services/          # Planned business logic
└── utils/             # Planned utilities
```

### AI Service (FastAPI)

```
ai-service/app/
├── main.py            # FastAPI app entry point
├── api/               # Planned API endpoints
├── core/              # Planned core logic
│   ├── rag.py         # RAG implementation
│   ├── llm.py         # LLM wrapper
│   └── vector_store.py # Vector database
└── models/            # Planned Pydantic schemas
```

## Environment Configuration

### Required Environment Variables

**Backend (.env):**

```bash
FLASK_ENV=development
MONGODB_URI=mongodb://admin:password123@mongo:27017/legal_ai?authSource=admin
AI_SERVICE_URL=http://ai-service:8000
FLASK_SECRET_KEY=your-secret-key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**AI Service (.env):**

```bash
OPENAI_API_KEY=your-openai-api-key
LOCAL_MODEL_PATH=./models/llama-2-7b  # For local models
```

**Frontend (.env.local):**

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
```

**Database:**

```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=legal_ai
```

## Key Development Notes

### Current Implementation Status

- **Infrastructure**: Fully set up with Docker, CI/CD, pre-commit hooks
- **Frontend**: Basic Next.js app with TypeScript, minimal pages
- **Backend**: Basic Flask app with simple routing
- **AI Service**: Basic FastAPI app structure
- **Database**: MongoDB configured with initialization

### Planned Integrations

- **ServiceNow**: For case escalation (environment variables prepared)
- **AI/ML Libraries**: Requirements.txt includes commented dependencies for:
  - OpenAI, LangChain, ChromaDB
  - Sentence Transformers, NumPy, Pandas
  - PyPDF for document processing

### Database Schema

MongoDB collections planned:

- `queries` - User queries and responses
- `form_templates` - Dynamic form configurations
- `analytics` - Usage and performance metrics

### Development Best Practices

1. **Follow GitFlow**: Create feature branches from develop with Jira ticket references
2. **Conventional commits**: Use `type(SPRNT2-XX): description` format
3. **Start containers first**: `make dev-up`
4. **Always run tests before committing**: `make test` (requires containers)
5. **Format code before committing**: `make format` (requires containers)
6. **Daily rebase**: `git rebase develop` to avoid conflicts
7. **Use absolute imports** in Python services
8. **Follow TypeScript strict mode** in frontend
9. **Write tests for new features** - all services have test directories set up
10. **100% containerized development** - no local installations needed

### Debugging Tips

- **Frontend**: Check browser console and Next.js dev server logs
- **Backend**: Flask debug mode enabled in development
- **AI Service**: FastAPI automatic OpenAPI docs at http://localhost:8000/docs
- **Database**: Connect via MongoDB Compass to localhost:27017
- **Docker**: Use `docker-compose logs [service-name]` for service-specific logs

### Common Commands

```bash
# View logs for specific service
docker-compose logs -f backend

# Restart single service
docker-compose restart frontend

# Execute commands in running container
docker-compose exec backend python -c "print('Hello')"

# Reset database
docker-compose down -v && docker-compose up

# Install new Python dependency
docker-compose exec backend pip install new-package
docker-compose exec backend pip freeze > requirements.txt
```

This project follows modern development practices with comprehensive tooling for code quality, testing, and deployment. The microservices architecture allows for independent development and scaling of different components.
