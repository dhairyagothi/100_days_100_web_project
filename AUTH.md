# Authentication Setup (Contributors)

This guide explains how to run **Google OAuth**, **GitHub OAuth**, and **local username/password** login on the main site entry point (`public/Login.html`).

> **Note:** OAuth requires the Node auth server. Static-only hosting (`npx serve`) does not support OAuth callbacks.

---

## Prerequisites

- **Node.js 18+**
- **MongoDB** (local install or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- **Google OAuth credentials** (optional but recommended)
- **GitHub OAuth App** (optional but recommended)

---

## 1. Install dependencies

From the repository root:

```bash
npm install
```

---

## 2. Configure environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` and set:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing session tokens |
| `SESSION_SECRET` | Long random string for OAuth handshake sessions |
| `BASE_URL` | App URL, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `NODE_ENV` | `development` locally, `production` on Vercel |

Generate secrets (example):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3. Create OAuth apps

### Google

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**
2. Create **OAuth client ID** → type **Web application**
3. Add **Authorized redirect URI**:
   - Local: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://YOUR-DOMAIN/api/auth/google/callback`
4. Scopes used: `profile`, `email`

### GitHub

1. Open [GitHub Developer Settings](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. Set **Authorization callback URL**:
   - Local: `http://localhost:3000/api/auth/github/callback`
   - Production: `https://YOUR-DOMAIN/api/auth/github/callback`
3. Scopes used: `user:email` (GitHub also returns basic profile data)

---

## 4. Run locally

```bash
npm run dev
```

Open:

- Homepage: [http://localhost:3000/index.html](http://localhost:3000/index.html)
- Login: [http://localhost:3000/public/Login.html](http://localhost:3000/public/Login.html)
- Sign up: [http://localhost:3000/public/SignUp.html](http://localhost:3000/public/SignUp.html)

### What you can test

- **Local login** — username + password (stored in MongoDB, bcrypt hashed)
- **Local sign up** — creates a new account via API
- **Continue with Google** — OAuth sign-in / sign-up
- **Continue with GitHub** — OAuth sign-in / sign-up
- **Navbar** — shows “Hi, {username}” when authenticated; **Log out** clears the session cookie

---

## 5. Deploy to Vercel

1. Push your branch and deploy on Vercel
2. In **Project Settings → Environment Variables**, add all variables from `.env.example`
3. Set `BASE_URL` to your production URL (e.g. `https://100-days-100-web-project.vercel.app`)
4. Update Google and GitHub redirect/callback URLs to use the production domain
5. Redeploy after changing env vars

API routes are served at `/api/auth/*` via Vercel serverless functions.

---

## API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/auth/register` | Local sign up |
| `POST` | `/api/auth/login` | Local login |
| `GET` | `/api/auth/me` | Current user (navbar session check) |
| `POST` | `/api/auth/logout` | Clear session |
| `GET` | `/api/auth/google` | Start Google OAuth |
| `GET` | `/api/auth/google/callback` | Google OAuth callback |
| `GET` | `/api/auth/github` | Start GitHub OAuth |
| `GET` | `/api/auth/github/callback` | GitHub OAuth callback |

Sessions are stored as **httpOnly JWT cookies** (`auth_token`). Provider access tokens are **not** persisted.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `redirect_uri_mismatch` | Callback URL in Google/GitHub must exactly match `BASE_URL` + `/api/auth/.../callback` |
| OAuth buttons do nothing | Run `npm run dev` (not static `serve` only) |
| `MONGODB_URI is not set` | Add MongoDB URI to `.env` |
| GitHub login works but email missing | GitHub may hide email; app uses GitHub noreply address |
| Navbar still shows “Sign in” after login | Ensure you use the same origin (e.g. `localhost:3000`) and cookies are not blocked |
| Docker/nginx only | OAuth is not supported in the static nginx container; use `npm run dev` or Vercel |
| Forgot Password page | [`public/ForgotPassword.html`](public/ForgotPassword.html) still uses legacy browser storage and is not connected to the new auth API yet |

---

## Verify locally (quick smoke test)

With MongoDB running and `.env` configured:

```bash
npm run dev
```

In another terminal:

```bash
# Register
curl -c cookies.txt -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","username":"demo_user","email":"demo@example.com","password":"Demo@123"}'

# Session check
curl -b cookies.txt http://localhost:3000/api/auth/me

# Logout
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3000/api/auth/logout
```

Expected: register returns `201`, `/me` returns username after register/login, and `401` after logout.

---

## Security notes

- Never commit `.env` or OAuth secrets
- Use strong `JWT_SECRET` and `SESSION_SECRET`
- In production, cookies use `secure: true` (HTTPS required)
- Rotate credentials if exposed
