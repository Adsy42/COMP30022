.PHONY: help test lint format build clean dev-up dev-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)


test: ## Run all tests in containers
	@echo "Running backend tests..."
	docker-compose exec backend pytest
	@echo "Running AI service tests..."
	docker-compose exec ai-service pytest
	@echo "Running frontend tests..."
	docker-compose exec frontend npm test

format: ## Format all code in containers
	@echo "Formatting backend..."
	docker-compose exec backend black .
	@echo "Formatting AI service..."
	docker-compose exec ai-service black .
	@echo "Formatting frontend (auto-fix)..."
	docker-compose exec frontend npm run format

lint: ## Lint all code in containers
	@echo "Linting backend..."
	docker-compose exec backend ruff check .
	@echo "Linting AI service..."
	docker-compose exec ai-service ruff check .
	@echo "Linting frontend..."
	docker-compose exec frontend npm run lint

build: ## Build all services
	@echo "Building with Docker Compose..."
	docker-compose build

dev-up: ## Build and start development environment
	@echo "Cleaning old build artifacts..."
	$(MAKE) clean
	@echo "Starting development environment (rebuild only if dependencies/config changed)..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-down: ## Stop development environment
	@echo "Stopping development environment..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

clean: ## Clean up build artifacts
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	cd frontend && rm -rf .next build coverage
	docker system prune -f