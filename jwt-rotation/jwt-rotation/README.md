# Secure JWT Rotation with Refresh Token Reuse Detection & Redis Blacklisting

## Architecture Overview

```
┌────────────────────┐         ┌──────────────────────────────────────┐
│   React Frontend   │         │          Express Backend              │
│                    │         │                                        │
│  ┌──────────────┐  │         │  ┌────────────┐  ┌─────────────────┐ │
│  │ AuthContext  │  │         │  │   Redis    │  │    MongoDB      │ │
│  │ (user state) │  │         │  │ Blacklist  │  │ TokenFamily     │ │
│  └──────┬───────┘  │         │  └────────────┘  └─────────────────┘ │
│         │          │         │                                        │
│  ┌──────▼────────┐ │  HTTPS  │  ┌────────────────────────────────┐  │
│  │ axiosInstance │◄├─────────┤►│         Auth Middleware         │  │
│  │ (interceptor) │ │         │  │  1. Check Redis blacklist       │  │
│  └───────────────┘ │         │  │  2. Verify JWT signature        │  │
│                    │         │  └────────────────────────────────┘  │
│  Access Token:     │         │                                        │
│  ✅ Memory only    │         │  ┌────────────────────────────────┐  │
│  ❌ NOT localStorage│         │  │      /api/auth/refresh         │  │
│                    │         │  │  1. Verify refresh token JWT   │  │
│  Refresh Token:    │         │  │  2. Check usedTokens[]         │  │
│  ✅ httpOnly cookie│         │  │  3. Rotate token pair          │  │
│  ❌ NOT readable by│         │  └────────────────────────────────┘  │
│     JavaScript     │         │                                        │
└────────────────────┘         └──────────────────────────────────────┘
```

## Security Features

### 1. Token Storage (XSS Prevention)
| Token | Storage | Accessible to JS? |
|-------|---------|------------------|
| Access Token | Memory (React state) | ✅ Yes (in-app only) |
| Refresh Token | httpOnly Cookie | ❌ No |

### 2. Refresh Token Rotation (RTR)
Every time a refresh token is used, it is **immediately invalidated** and replaced with a new one. The old token is archived in `usedTokens[]`.

### 3. Reuse Detection
If a previously-used refresh token arrives at `/api/auth/refresh`:
- The **entire token family is invalidated**
- All active sessions for that user are terminated
- User must log in again

This covers the breach scenario: attacker steals token → legitimate user rotates → attacker tries old token → system detects reuse → all sessions killed.

### 4. Redis Blacklisting
On logout, the current access token (still valid for up to 15 min) is stored in Redis with a TTL equal to its remaining lifetime. The auth middleware checks this before trusting any access token.

### 5. Secure Cookie Flags
```
httpOnly   = true   → JS cannot read the cookie
secure     = true   → HTTPS only (in production)
sameSite   = Strict → CSRF protection
path       = /api/auth → Cookie only sent to auth routes
```

## Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Redis Cloud)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, Redis config, and JWT secrets
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env with: REACT_APP_API_URL=http://localhost:5000
npm start
```

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login, get token pair |
| POST | `/api/auth/refresh` | ❌ (cookie) | Rotate tokens |
| POST | `/api/auth/logout` | ✅ Bearer | Invalidate session |
| GET | `/api/auth/me` | ✅ Bearer | Get current user |

## Token Flow Diagram

```
Login
  │
  ├── Generate familyId (UUID)
  ├── Create TokenFamily in MongoDB { currentToken, usedTokens: [] }
  ├── Set refreshToken in httpOnly cookie
  └── Return accessToken in JSON body (stored in memory)

Every API Request
  │
  ├── Axios interceptor adds: Authorization: Bearer <accessToken>
  └── Backend middleware:
        ├── Check Redis blacklist
        └── Verify JWT signature

Access Token Expires (401 received)
  │
  ├── Axios interceptor fires /api/auth/refresh
  ├── Cookie sent automatically
  ├── Backend rotates:
  │     ├── Push currentToken → usedTokens[]
  │     └── Set new currentToken
  ├── New accessToken returned
  ├── All queued requests retried with new token
  └── User never sees interruption

Reuse Detected
  │
  ├── TokenFamily.isActive = false
  ├── Cookie cleared
  └── User forced to re-login

Logout
  │
  ├── Blacklist accessToken in Redis (TTL = remaining lifetime)
  ├── TokenFamily.isActive = false
  └── Cookie cleared
```

## Frontend Usage

```jsx
// Wrap your app
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <YourRoutes />
    </AuthProvider>
  );
}

// Use in any component
import { useAuth } from './hooks/useAuth';

function Dashboard() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <p>Welcome, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// All API calls — token handled automatically
import axiosInstance from './api/axiosInstance';

const fetchData = async () => {
  // No manual token management needed!
  const response = await axiosInstance.get('/api/protected-route');
  return response.data;
};
```

## File Structure

```
jwt-rotation/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── redis.js           # Redis client
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT + Redis blacklist check
│   ├── models/
│   │   ├── User.js            # User schema with bcrypt
│   │   └── TokenFamily.js     # Token family + reuse detection
│   ├── routes/
│   │   └── authRoutes.js      # All auth endpoints
│   ├── utils/
│   │   └── tokenUtils.js      # Token generation + cookie helpers
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    └── src/
        ├── api/
        │   └── axiosInstance.js   # Axios + refresh interceptor
        └── hooks/
            └── useAuth.js         # Auth context + React hook
```