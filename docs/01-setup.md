# ⚙️ Development Setup Guide

> **📍 You are here:** [Documentation Index](./README.md) → **Setup Guide**
>
> **➡️ Next:** [Git Workflow](./02-git-workflow.md)

## Prerequisites

- Docker and Docker Compose
- Make (optional, for convenience)
- Git

**No local Node.js or Python installations required** - everything runs in containers!

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd COMP30022
   ```

2. **Set up environment variables**

   ```bash
   # Copy environment files
   cp .env.example .env
   cp frontend/.env.local.example frontend/.env.local
   cp backend/.env.example backend/.env
   cp ai-service/.env.example ai-service/.env

   # Edit the files with your actual values
   ```

3. **Start all services with Docker**

   ```bash
   # Development mode (with hot reload)
   make dev-up
   # or manually:
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000
   - MongoDB: localhost:27017

## Testing and Development Commands

All commands run inside containers (requires containers to be running first):

```bash
# Run all tests
make test

# Format all code
make format

# Lint all code
make lint

# Or run individual commands
docker-compose exec backend pytest
docker-compose exec ai-service pytest
docker-compose exec frontend npm test
```

## Database Setup

MongoDB will be automatically initialized with:

- Basic form templates
- Required indexes

## Useful Commands

```bash
# View logs for specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f ai-service

# Stop all services
make dev-down
# or manually:
docker-compose down

# Remove all data (reset database)
docker-compose down -v

# Clean up build artifacts
make clean
```

## Troubleshooting

### Port conflicts

If ports are already in use, modify the port mappings in `docker-compose.yml`.

### Database connection issues

Ensure MongoDB is running and the connection string is correct in your `.env` files.

### AI Service issues

Check that you have valid API keys or local models configured in `ai-service/.env`.

## Development Workflow

1. Start containers: `make dev-up`
2. Create feature branch from main
3. Make changes
4. Test: `make test`
5. Format: `make format`
6. Ensure all checks pass
7. Create pull request

## Team Responsibilities

- **Farah (Frontend)**: Next.js application, UI components, user experience
- **Himank (Backend)**: Flask API, database models, integrations
- **Yusuf (AI)**: RAG implementation, AI service, embeddings
- **Bryan (Scrum Master)**: Project coordination, documentation
- **Adam (Product Owner)**: Requirements, stakeholder communication

---

**✅ Environment Ready?** → **[Next: Git Workflow](./02-git-workflow.md)**
