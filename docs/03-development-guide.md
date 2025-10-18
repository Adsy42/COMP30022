# 💻 Development Guide

> **📍 You are here:** [Documentation Index](./README.md) → [Setup Guide](./01-setup.md) → [Git Workflow](./02-git-workflow.md) → **Development Guide**
>
> **➡️ Reference:** [Project Structure](./04-project-structure.md) | [Technical Context](../CLAUDE.md)

## Overview

Docker-based MVP development setup with comprehensive CI/CD pipeline.

## Prerequisites

- Docker & Docker Compose
- Make (optional, for convenience)

**No local installations required** - everything runs in containers!

## Quick Start

```bash
# Start development environment
make dev-up

# Run all tests
make test

# Format code
make format

# Stop development environment
make dev-down
```

## Available Services

- **Frontend**: http://localhost:3000 (Next.js/React)
- **Backend**: http://localhost:5000 (Flask API)
- **AI Service**: http://localhost:8000 (FastAPI)
- **MongoDB**: localhost:27017

## Testing

All tests run inside containers:

```bash
# All tests (requires containers to be running)
make test

# Or individual services
docker-compose exec backend pytest
docker-compose exec ai-service pytest
docker-compose exec frontend npm test
```

## Code Formatting

All formatting runs inside containers:

```bash
# Format all code (requires containers to be running)
make format

# Or individual services
docker-compose exec backend black .
docker-compose exec ai-service black .
docker-compose exec frontend npm run format
```

## CI Pipeline

Comprehensive GitHub Actions workflow that:

- **Format checks**: Black for Python, Prettier for frontend
- **Linting**: Ruff for Python, ESLint for frontend
- **Type checking**: TypeScript for frontend
- **Testing**: pytest for Python services, Jest for frontend
- **Docker validation**: Validates docker-compose configuration
- **Parallel execution**: All jobs run concurrently for speed

## Development Workflow

### GitFlow Strategy

We use a GitFlow-adapted strategy with `main` and `develop` branches:

1. **Start containers**: `make dev-up`
2. **Create feature branch**: `git checkout -b feature/SPRNT2-XX-description`
3. **Make changes** with conventional commits
4. **Daily rebase**: `git rebase develop` to avoid conflicts
5. **Run tests**: `make test`
6. **Format code**: `make format`
7. **Create PR** to develop branch with Jira ticket reference
8. **Code review** and squash merge

### Commit Message Format

```
type(SPRNT2-XX): description

Optional body explaining what and why

Closes SPRNT2-XX
```

**Types:** feat, fix, docs, style, refactor, test, chore

### Branch Protection

- **main**: 2 reviewers required, admin-only
- **develop**: 1 reviewer required, squash merge only

Fully containerized development with zero local dependencies!
