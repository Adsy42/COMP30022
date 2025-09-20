# Legal AI Query & Referral System - COMP30022

A unified platform for University of Melbourne researchers to submit grants-related queries and receive AI-powered assistance or escalation to the legal team.

## 🚀 Getting Started

**New to the project?** Follow our documentation in order:

👉 **[📚 Start Here - Documentation Guide](./docs/README.md)**

Or jump directly to:
1. **[⚙️ Setup Guide](./docs/01-setup.md)** - Get your environment running
2. **[🌿 Git Workflow](./docs/02-git-workflow.md)** - Learn our development process
3. **[💻 Development Guide](./docs/03-development-guide.md)** - Daily development practices

## Tech Stack

- **Frontend**: Next.js/React with TypeScript
- **Backend API**: Python Flask
- **Database**: MongoDB
- **AI Service**: Python microservice with RAG capabilities
- **Containerization**: Docker & Docker Compose

## Project Structure

```
COMP30022/
├── frontend/                # Next.js application
├── backend/                 # Flask API server
├── ai-service/             # AI/LLM microservice
├── docker/                 # Docker configurations
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── docker-compose.yml      # Orchestration
```

## Quick Start

## Prerequisites

- Docker & Docker Compose
- Make (optional)

**No local Python/Node.js required** - fully containerized!

```bash
# Clone the repository
git clone https://github.com/yourusername/COMP30022.git
cd COMP30022

# Start development environment
make dev-up
# or manually:
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# AI Service: http://localhost:8000
```

## Development Workflow

### GitFlow Strategy
We use GitFlow with `main` and `develop` branches:

```bash
# Start development
git checkout develop && git pull origin develop
git checkout -b feature/SPRNT2-XX-description

# Daily workflow
make test    # Run tests (containers must be running)
make format  # Format code
make lint    # Lint code

# Create PR to develop branch
# Code review → Squash merge
```

### Commit Format
```
feat(SPRNT2-XX): add chat interface

Implement real-time messaging with validation

Closes SPRNT2-XX
```

## Team

- **Product Owner**: Adam
- **Frontend Lead**: Farah
- **Backend Lead**: Himank
- **AI Lead**: Yusuf
- **Scrum Master**: Bryan

## Features

- **Fully containerized**: Zero local dependencies
- **CI/CD pipeline**: Automated testing, linting, formatting
- **Microservices**: Frontend, Backend, AI Service, Database
- **Hot reload**: Development with live code changes

## 📚 Documentation

**📋 Quick Access:**
- **[📚 Documentation Index](./docs/README.md)** - **Start here for complete guide**
- **[⚙️ Setup Guide](./docs/01-setup.md)** - Environment setup
- **[🌿 Git Workflow](./docs/02-git-workflow.md)** - Branching and commits
- **[💻 Development Guide](./docs/03-development-guide.md)** - Daily workflow
- **[🏗️ Project Structure](./docs/04-project-structure.md)** - Codebase organization
- **[🤖 Technical Context](./CLAUDE.md)** - Detailed technical info

**🎯 For Your Role:**
- **New Developer?** → [Documentation Index](./docs/README.md)
- **Code Review?** → [Git Workflow](./docs/02-git-workflow.md)
- **Need Architecture?** → [Project Structure](./docs/04-project-structure.md)
