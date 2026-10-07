.PHONY: help dev docker-up docker-down lint lint-all docker-build docker-run

help:
	@echo "Available commands:"
	@echo "  make dev           - Start local dev server (requires Node.js)"
	@echo "  make docker-up     - Start using Docker Compose"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-run    - Run Docker container"
	@echo "  make lint          - Lint main HTML files"
	@echo "  make lint-all      - Lint all HTML files in the project"

dev:
	npm run dev

docker-up:
	docker compose up --build -d

docker-down:
	docker compose down

docker-build:
	docker build -t 100days-web .

docker-run:
	docker run --rm -p 8080:80 100days-web

lint:
	npm run lint

lint-all:
	npm run lint:all
