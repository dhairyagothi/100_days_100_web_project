# AGENTS.md — 100 Days 100 Web Projects

## Repo structure

- `index.html` / `index.js` / `style.css` — main showcase site (vanilla HTML/CSS/JS, no framework)
- `public/` — every individual project lives in its own subdirectory
- `contributors/` — contributors showcase page
- `projects.json` — used by an embedded code playground on the site (not the main project registry)
- `.github/workflows/` — CI: HTML lint, link check (both warn-only), Docker build, Trivy scan

## Core workflow

**To add a project**:
1. Create `public/<ProjectName>/index.html` (and optional `style.css`, `script.js`, `README.md`)
2. Add an entry to the `PROJECT_DATA` array in `index.js` at line 38 — format: `["Day N", "Name", "./public/ProjectName/index.html", "tags", "beginner|intermediate"]`

**To test**: open `index.html` in browser, or use `npm run dev` (port 3000).

## Commands

| Purpose | Command |
|---|---|
| Dev server | `npm run dev` (or `make dev`) |
| Lint main HTML | `npm run lint` (warn-only in CI) |
| Lint all HTML | `npm run lint:all` |
| Docker up | `make docker-up` or `docker compose up --build` |

CI is warn-only — non-blocking on lint, link checks, and security scans.

## Conventions

- HTML: lowercase tags/attrs, double-quoted values, tag pairs required (`htmlhint` enforced)
- JS: `const`/`let`, arrow functions, no `var`
- CSS: semantic class names, 2-space indentation
- Project tags in `index.js` use lowercase space-separated keywords (e.g. `"game javascript"`, `"api javascript"`, `"clone css"`)
- Deployment: Vercel (static, no build step). Also Docker (Nginx Alpine) and GitHub Pages.

## No test framework

All testing is manual. No test runner, no typechecker. Skip `npm install` — there are no runtime dependencies.
