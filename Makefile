# ============================================================================
# 100 Days 100 Web Projects — Makefile
# Standardized developer commands for local development
# ============================================================================

.PHONY: help dev lint docker-build docker-run docker-up docker-down clean

# Default target
help: ## Show this help message
	@echo ""
	@echo "  100 Days 100 Web Projects — Developer Commands"
	@echo "  ═══════════════════════════════════════════════"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ── Local Development ─────────────────────────────────────────

dev: ## Start local dev server (requires npx/Node.js)
	@echo "🚀 Starting local dev server on http://localhost:3000"
	npx -y serve . -p 3000

# ── Linting ───────────────────────────────────────────────────

lint: ## Run HTML linting on the main site files
	@echo "🔍 Running HTML linter..."
	npx -y htmlhint index.html contributors/contributor.html

lint-all: ## Run HTML linting on all HTML files (may have many warnings)
	@echo "🔍 Running HTML linter on all files..."
	npx -y htmlhint "**/*.html" --ignore "node_modules/**,**/node_modules/**"

# ── Docker ────────────────────────────────────────────────────

docker-build: ## Build the Docker image
	@echo "🐳 Building Docker image..."
	docker build -t 100days-web .

docker-run: docker-build ## Build and run the Docker container
	@echo "🐳 Running container on http://localhost:8080"
	docker run --rm -p 8080:80 --name 100days-web 100days-web

docker-up: ## Start with Docker Compose (background)
	@echo "🐳 Starting services with Docker Compose..."
	docker compose up --build -d
	@echo "✅ Site available at http://localhost:8080"

docker-down: ## Stop Docker Compose services
	@echo "🐳 Stopping services..."
	docker compose down

docker-logs: ## View Docker container logs
	docker compose logs -f web

# ── Cleanup ───────────────────────────────────────────────────

clean: ## Remove Docker images and containers
	@echo "🧹 Cleaning up..."
	-docker compose down --rmi local --volumes 2>/dev/null
	-docker rmi 100days-web 2>/dev/null
	@echo "✅ Cleanup complete"
