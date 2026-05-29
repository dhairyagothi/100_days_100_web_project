# Vercel Deployment Guide

## Quick Deploy Steps

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration"
   git push origin main 
   ```

2. **Vercel Settings:**
   - Framework Preset: **Other**
   - Build Command: **Leave empty** (no build needed)
   - Output Directory: **`.`** (current directory)
   - Install Command: **Leave empty**

3. **Add a Gemini API secret:**
   - Go to your Vercel project dashboard
   - Open **Settings → Environment Variables**
   - Add `GEMINI_API_KEY` with your Gemini API key
   - Deploy to the **Production** environment (or add the same variable for Preview)

4. **Redeploy:**
   - Go to your Vercel dashboard
   - Click "Redeploy" on the latest deployment
   - Or trigger a new deployment by pushing to GitHub

## What Was Fixed

✅ Corrected `vercel.json` configuration for static site hosting  
✅ Set proper output directory to root (`.`)  
✅ Fixed absolute paths to relative paths in Login.html  
✅ Removed unnecessary rewrites that caused 404 errors  
✅ Added proper cache headers for static assets  

## Project Structure

```
/
├── index.html              # Main entry point
├── index.js                # Project routing logic
├── vercel.json             # Vercel configuration
├── contributors/           # Contributors page
└── public/                 # All 142+ projects
    ├── Login.html
    ├── signup.html
    └── [project folders]/
```

## Troubleshooting

If you still see 404 errors:

1. Check Vercel deployment logs
2. Verify all file paths use relative paths (`./` or `../`)
3. Ensure no absolute paths starting with `/`
4. Clear browser cache and try again

## Testing Locally

### Option 1: Simple File Open
Open `index.html` directly in your browser to test locally before deploying.

### Option 2: Local Dev Server (Recommended)
```bash
# Using npm scripts (requires Node.js)
npm run dev
# → Site available at http://localhost:3000

# Or using Make
make dev
```

### Option 3: Docker (No Node.js Required)
```bash
# Using Docker Compose (recommended)
docker compose up --build
# → Site available at http://localhost:8080

# Or using Make
make docker-up

# Stop the container
docker compose down
# or
make docker-down
```

---

## Docker Deployment

The project includes a production-ready Docker setup using **Nginx Alpine**.

### Quick Start

```bash
# Build and run
docker build -t 100days-web .
docker run -p 8080:80 100days-web

# Or with Docker Compose
docker compose up --build -d
```

### What's Included

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage Nginx Alpine build |
| `docker-compose.yml` | One-command local development |
| `nginx.conf` | Custom Nginx config with security headers & gzip |
| `.dockerignore` | Optimized build context |

### Docker Image Features

- 🏗️ **Nginx Alpine** — Minimal image size (~50 MB)
- 🔒 **Security headers** — Mirrors Vercel config (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- ⚡ **Gzip compression** — CSS, JS, SVG, and fonts compressed automatically
- 📦 **Static asset caching** — 7-day cache for immutable assets
- ❤️ **Health checks** — Built-in container health monitoring

### CI/CD

On every push to `Main`, the Docker image is automatically:
1. **Built and tested** via the CI pipeline
2. **Scanned for vulnerabilities** using Trivy
3. **Published to GitHub Container Registry** (`ghcr.io`)

Pull the latest image:
```bash
docker pull ghcr.io/dhairyagothi/100_days_100_web_project:latest
docker run -p 8080:80 ghcr.io/dhairyagothi/100_days_100_web_project:latest
```
