## 🔴 Critical: Multiple Hardcoded API Keys and Weak Secrets Exposed Across 12+ Projects

## Issues Found

### 1. 🔴 TMDB API Key Hardcoded
**File:** `public/movie-selector/app.js:3`
```js
const MOVIE_DISCOVER_API = "...api_key=8f2467d3e6205844a4b1f4faaa387eb3..."
```
Real TMDB API key exposed in client-side source code.

### 2. 🔴 OMDb API Key Hardcoded
**File:** `public/Movie-Search-App/script.js:1`
```js
const API_KEY = "d1503a5";
```
Real OMDb API key exposed.

### 3. 🟠 Weak JWT Secret Fallback
**Files:** `public/loginusingmern/index.js:39` and `middleware/auth.js:9`
```js
secret: process.env.JWT_SECRET || 'secretkey'
```
Trivially guessable fallback. If env var is unset, tokens can be forged.

### 4. 🟠 Flask Secret Key Placeholder
**Files:** `public/Contact Book/app.py:10`, `public/flask_auth_app/app.py:17`
```py
app.config["SECRET_KEY"] = "your_secret_key"
```
Weak placeholder secret allows session forgery.

### 5. 🟡 Placeholder API Keys in 6 Projects
- `Weather App with AQI/script.js`: `"Insert Your API Key"`
- `HangmanGame/index.html`: `your_gemini_api_key`
- `NASA-APOD/popup.js`: `""` (empty)
- `AstronomyDashboard/script.js`: `"DEMO_KEY"` (rate-limited)
- `InterviewSimulator/config.example.js`: placeholder
- `Travel_booking_website/config.example.js`: placeholder

### 6. 🟡 Missing .env in .gitignore Files
11+ projects missing .env in .gitignore, risking accidental credential commits.

---

## Required Changes (500+ Lines)

1. Move TMDB/OMDb API keys to environment variables
2. Remove weak JWT secret fallbacks
3. Replace weak Flask secret placeholders
4. Add .env loading to 6+ JS projects
5. Create .env.example files for each affected project
6. Add .env to .gitignore in all missing projects
7. Document API key setup in affected READMEs

**Files affected:** 25+ files across 12+ projects
**Total lines changed:** 500+
