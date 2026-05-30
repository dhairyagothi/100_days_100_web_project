# Full Stack Event Registration System — Zenith 2026

## Project Overview

Zenith 2026 is a full-stack event registration system built to manage participant registrations for a college-level event. The system provides a public-facing registration portal where attendees can sign up, and a secure admin dashboard where organizers can monitor registrations, apply filters, and view real-time analytics.

**Problem it solves:** Manual event registration through spreadsheets or Google Forms offers no duplicate prevention, no real-time analytics, and no role-based access control. This system replaces that with a purpose-built web application that handles validation, deduplication, JWT-protected admin views, and live charts — all in one place.

**Core functionality:**
- Public registration form with full field validation
- Unique registration ID generation per attendee
- JWT-authenticated admin login
- Searchable, filterable attendee table
- Analytics dashboard with domain split and daily registration graph

---

## Features

### User Features
- Register for the event using a clean, responsive form
- Fields: Full Name, Email, College/University, Year of Study, Domain (Technical / Non-Technical), Interest description
- Client-side validation with real-time error messages
- Duplicate email detection with a clear error response
- Confirmation page displaying a unique Registration ID and submitted details
- Fully mobile-responsive layout

### Admin Features
- Secure login with email and password (JWT-based)
- View all registrations in a paginated, sortable table
- Search registrations by name or email
- Filter by college (partial match) and domain
- Analytics overview: total registrations, Technical vs Non-Technical count, daily registration bar chart, domain split pie chart
- One-click navigation back to the registration portal from the admin panel

### Backend Features
- RESTful API built with Express and TypeScript
- Server-side validation using Zod schemas shared between frontend and backend
- Duplicate email prevention before insert
- Secure password hashing using Node's built-in `scrypt` (no third-party bcrypt dependency)
- JWT token issuance with 24-hour expiry
- Protected routes via Bearer token middleware
- Seed script that auto-creates the admin user on first boot

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 (Vite) | UI framework and build tooling |
| TypeScript | Static typing across all components |
| Tailwind CSS | Utility-first styling |
| TanStack Query (React Query v5) | Server state management, caching, and mutations |
| React Hook Form + Zod | Form state and schema-driven validation |
| Recharts | Analytics charts (bar chart, pie chart) |
| Wouter | Lightweight client-side routing |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | HTTP server and API routing |
| TypeScript | Type-safe server logic |
| Drizzle ORM | Type-safe database queries and schema definition |
| Zod | Runtime validation of request payloads |
| jsonwebtoken | JWT generation and verification |
| Node.js `crypto` (scrypt) | Secure password hashing with salt |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database for persistent storage |
| drizzle-kit | Schema migration tooling (`db:push`) |

### Other Tools
| Tool | Purpose |
|---|---|
| `drizzle-zod` | Auto-generates Zod schemas from Drizzle table definitions |
| `date-fns` | Date formatting in the dashboard |
| `tsx` | TypeScript execution for the Express server in development |

---

## System Architecture

The application follows a classic three-tier architecture: a React SPA for the frontend, an Express REST API for the backend, and PostgreSQL as the database. Both frontend and backend share types through a `shared/` directory, making the API contract type-safe end-to-end.

```
┌─────────────────────────────────┐
│         Browser (React SPA)     │
│  Registration Form / Dashboard  │
│     TanStack Query + Zod        │
└────────────┬────────────────────┘
             │ HTTP (fetch)
             │ Bearer Token (admin routes)
             ▼
┌─────────────────────────────────┐
│      Express REST API           │
│  server/routes.ts               │
│  Zod validation middleware      │
│  JWT auth middleware            │
└────────────┬────────────────────┘
             │ Drizzle ORM
             ▼
┌─────────────────────────────────┐
│         PostgreSQL              │
│  tables: users, registrations   │
└─────────────────────────────────┘

Shared Layer (shared/)
  schema.ts  ──▶  Drizzle table defs + inferred TypeScript types
  routes.ts  ──▶  Zod API contract used by both client and server
```

**Key design choice:** The `shared/` directory acts as the single source of truth for both the database schema and the API contract. This means if a field is added to the database, the TypeScript types and Zod validation schemas update automatically everywhere — no manual synchronisation.

---

## Folder Structure

```
zenith-2026/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminNav.tsx
│   │   │   ├── RegistrationForm.tsx
│   │   │   └── ui/
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   └── use-registrations.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Success.tsx
│   │   │   └── admin/
│   │   │       ├── Login.tsx
│   │   │       └── Dashboard.tsx
│   │   ├── lib/
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   └── index.html
│
├── server/
│   ├── db.ts
│   ├── storage.ts
│   ├── routes.ts
│   ├── index.ts
│   └── vite.ts
│
├── shared/
│   ├── schema.ts
│   └── routes.ts
│
├── drizzle.config.ts
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

The database has two tables: `users` for admin accounts and `registrations` for event attendees.

### `users` table — Admin accounts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Auto-incrementing integer |
| `email` | `text` | NOT NULL, UNIQUE | Admin login identifier |
| `password` | `text` | NOT NULL | Scrypt-hashed password with embedded salt |
| `role` | `text` | NOT NULL, DEFAULT `'admin'` | Role field for future RBAC extension |

**Design rationale:** Passwords are stored as `hash.salt` in a single text column using Node's `scrypt` with a 16-byte random salt and a 64-byte derived key. This avoids any third-party dependency while remaining cryptographically secure. The `role` field is included for forward compatibility with multi-level access control.

### `registrations` table — Event attendees

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | PRIMARY KEY | Internal auto-increment ID |
| `registration_id` | `text` | NOT NULL, UNIQUE | Public-facing ID e.g. `REG-3A4F9C1B` |
| `name` | `text` | NOT NULL | Full name of attendee |
| `email` | `text` | NOT NULL, UNIQUE | Enforces one registration per email |
| `college` | `text` | NOT NULL | College/university name |
| `year` | `text` | NOT NULL | Year of study (1st–4th, Postgrad, Other) |
| `domain` | `text` | NOT NULL | `'Tech'` or `'Non-Tech'` |
| `interest_answer` | `text` | NOT NULL | Short description of interest |
| `created_at` | `timestamp` | NOT NULL, DEFAULT `now()` | Registration timestamp for analytics |

**Design rationale:** The `registration_id` is a human-readable `REG-` prefixed 8-character uppercase hex string generated via `crypto.randomUUID()`. This is used on the confirmation page and is distinct from the internal integer `id`. The `email` column has a UNIQUE constraint at the database level as a final safety net against duplicates — the application layer also checks before inserting. The `created_at` field drives the daily registrations graph in the analytics dashboard.

**Normalisation:** Both tables are in 3NF. Admins and registrations are fully separated. There is no redundant data. The `role` column on `users` avoids the need for a separate roles join table at this scale, while still being extensible.

---

## API Endpoints

All endpoints are prefixed with `/api`. Admin-protected endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/admin/login` | No | Authenticate admin, returns JWT |
| `POST` | `/api/register` | No | Register a new attendee |
| `GET` | `/api/registrations` | Yes | List all registrations (supports filters) |
| `GET` | `/api/analytics` | Yes | Aggregated analytics data |

---

## State Management Approach

State is managed using a layered approach:

| Layer | Tool | Responsibility |
|-------|------|----------------|
| Server state | **TanStack Query v5** | Fetching, caching, and invalidating API data. All queries use typed `queryKey` arrays. Mutations call `queryClient.invalidateQueries` on success to keep the UI in sync. |
| Form state | **React Hook Form** | Controlled inputs with Zod resolver for schema-driven validation. Default values are always set to prevent uncontrolled component warnings. |
| Auth state | **localStorage + custom hook** | The JWT token is persisted in `localStorage`. The `use-auth.ts` hook exposes `getToken()`, `isAuthenticated()`, `login` mutation, and `logout`. This avoids a global auth context while keeping auth logic centralised. |
| UI state | **React `useState`** | Local component state for filter inputs (search, college, domain) on the dashboard. |
| Navigation state | **Wouter** | Client-side routing between `/`, `/success`, `/admin/login`, and `/admin/dashboard`. No server-side redirects are needed. |

---

## Error Handling Strategy

**Client-side (form validation):**
- Zod schemas from `shared/routes.ts` are used directly with `zodResolver` in React Hook Form
- Errors render below each field using shadcn's `<FormMessage />`
- The submit button is disabled during pending mutations

**Server-side (API validation):**
- Every request body is parsed with `schema.parse(req.body)` — a `ZodError` is caught and returns `400` with the failing field name
- Duplicate email is checked at the application layer before insert, returning `400` with `{ field: "email" }`
- The database has a UNIQUE constraint on `email` as a final safety net
- All catch blocks return appropriate HTTP status codes — never silent failures

---

## Authentication

The system uses **stateless JWT authentication** for all admin routes.

**Login flow:**
1. Admin submits email and password to `POST /api/admin/login`
2. Server fetches the user record by email, then verifies the supplied password against the stored scrypt hash using timing-safe comparison (`timingSafeEqual`)
3. On success, a JWT is signed with `{ id, email, role }` payload, `24h` expiry, using the `SESSION_SECRET` environment variable as the signing key
4. The token is returned to the client and stored in `localStorage`

**Protecting routes:**
- The `authenticateToken` Express middleware extracts the `Authorization: Bearer <token>` header
- `jwt.verify()` validates the signature and expiry — on failure it returns `401`
- The decoded user payload is attached to `req.user` for downstream handlers

**Frontend guard:**
- The Dashboard component calls `isAuthenticated()` on mount and redirects to `/admin/login` if no valid token is found
- The `use-auth.ts` hook calls `logout()` automatically when a `401` response is received from any protected endpoint, clearing the token and redirecting

---

## Scalability Considerations

| Area | Approach |
|-----|-----|
| Database | PostgreSQL supports large datasets and indexing for faster queries. |
| Authentication | JWT-based stateless authentication allows horizontal scaling without session storage. |
| API Design | Filtering is performed at the database level to avoid loading unnecessary data into memory. |
| Architecture | Frontend, backend, and shared layers are separated, allowing independent scaling and deployment. |

---

## How to Run the Project Locally

### Prerequisites
- Node.js 20+
- PostgreSQL database 

### Clone and install

```bash
git clone https://github.com/kumudasrip/event-registration-system.git
cd event-registration-system
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/zenith
SESSION_SECRET=your_super_secret_jwt_key
```

### Push the database schema

```bash
npm run db:push
```

This creates the `users` and `registrations` tables. The admin seed user (`adminzen@event.com` / `admin123zen`) is created automatically when the server first starts.

### Start the development server

```bash
npm run dev
```

This starts both the Express backend (port 5000) and the Vite frontend dev server simultaneously. Visit `http://localhost:5000` in your browser.

### Seed admin credentials

The admin user is seeded automatically on startup if it does not already exist:

| Field | Value |
|-------|-------|
| Email | `adminzen@event.com` |
| Password | `admin123zen` |

---

## Deployment

The project is structured as a unified full-stack application where Vite's built output is served by Express in production.

**Build:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

The Express server serves the compiled React app as static files and handles all `/api/*` routes. No separate frontend hosting is required.

**Environment variables required in production:**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret key for JWT signing (use a long random string) |
| `NODE_ENV` | Set to `production` |

---

## Postman Collection

A Postman collection is included below for testing all API endpoints.

Import the JSON into Postman and use the token returned from `POST /api/admin/login` for authenticated requests.

```json
{
  "info": {
    "name": "Zenith 2026 — Event Registration API",
    "_postman_id": "zenith-2026-collection",
    "description": "Complete API collection for the Zenith 2026 Full Stack Event Registration System. Covers public registration, admin authentication, filtered attendee listing, and analytics.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string",
      "description": "JWT token returned by POST /api/admin/login. Paste the value here after logging in."
    }
  ],
  "item": [
    {
      "name": "Public",
      "item": [
        {
          "name": "Register Attendee",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "register"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Priya Sharma\",\n  \"email\": \"priya.sharma@college.edu\",\n  \"college\": \"IIT Madras\",\n  \"year\": \"3rd Year\",\n  \"domain\": \"Tech\",\n  \"interestAnswer\": \"I am deeply interested in AI/ML and want to attend the workshops on neural networks.\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "description": "Register a new attendee for Zenith 2026. Returns a unique registrationId on success. Returns 400 if the email is already registered or any required field is missing."
          },
          "response": [
            {
              "name": "201 Created",
              "status": "Created",
              "code": 201,
              "body": "{\n  \"id\": 1,\n  \"registrationId\": \"REG-A3F19C2E\",\n  \"name\": \"Priya Sharma\",\n  \"email\": \"priya.sharma@college.edu\",\n  \"college\": \"IIT Madras\",\n  \"year\": \"3rd Year\",\n  \"domain\": \"Tech\",\n  \"interestAnswer\": \"I am deeply interested in AI/ML and want to attend the workshops on neural networks.\",\n  \"createdAt\": \"2026-03-13T09:00:00.000Z\"\n}"
            },
            {
              "name": "400 Duplicate Email",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"message\": \"Email already registered\",\n  \"field\": \"email\"\n}"
            },
            {
              "name": "400 Validation Error",
              "status": "Bad Request",
              "code": 400,
              "body": "{\n  \"message\": \"Invalid email\",\n  \"field\": \"email\"\n}"
            }
          ]
        },
        {
          "name": "Register Attendee — Non-Tech Domain",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "register"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Rahul Verma\",\n  \"email\": \"rahul.verma@university.ac.in\",\n  \"college\": \"Delhi University\",\n  \"year\": \"2nd Year\",\n  \"domain\": \"Non-Tech\",\n  \"interestAnswer\": \"I am passionate about entrepreneurship and product management.\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "description": "Register a Non-Tech domain attendee. The domain field only accepts 'Tech' or 'Non-Tech'."
          },
          "response": []
        }
      ]
    },
    {
      "name": "Admin — Auth",
      "item": [
        {
          "name": "Admin Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "var jsonData = pm.response.json();",
                  "if (jsonData.token) {",
                  "  pm.collectionVariables.set('token', jsonData.token);",
                  "  console.log('Token saved to collection variable: token');",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/admin/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "admin", "login"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"adminzen@event.com\",\n  \"password\": \"admin123zen\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "description": "Authenticate as admin. Returns a signed JWT valid for 24 hours. The test script automatically saves the token to the 'token' collection variable so protected requests work without manual copy-paste."
          },
          "response": [
            {
              "name": "200 OK",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbnplbkBldmVudC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDA4NjQwMH0.example_signature\"\n}"
            },
            {
              "name": "401 Invalid Credentials",
              "status": "Unauthorized",
              "code": 401,
              "body": "{\n  \"message\": \"Invalid credentials\"\n}"
            }
          ]
        }
      ]
    },
    {
      "name": "Admin — Registrations",
      "item": [
        {
          "name": "Get All Registrations",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"]
            },
            "description": "Returns the complete list of all registered attendees. Requires a valid JWT in the Authorization header."
          },
          "response": [
            {
              "name": "200 OK",
              "status": "OK",
              "code": 200,
              "body": "[\n  {\n    \"id\": 1,\n    \"registrationId\": \"REG-A3F19C2E\",\n    \"name\": \"Priya Sharma\",\n    \"email\": \"priya.sharma@college.edu\",\n    \"college\": \"IIT Madras\",\n    \"year\": \"3rd Year\",\n    \"domain\": \"Tech\",\n    \"interestAnswer\": \"I am deeply interested in AI/ML.\",\n    \"createdAt\": \"2026-03-13T09:00:00.000Z\"\n  }\n]"
            },
            {
              "name": "401 Unauthorized",
              "status": "Unauthorized",
              "code": 401,
              "body": "{\n  \"message\": \"Unauthorized\"\n}"
            }
          ]
        },
        {
          "name": "Get Registrations — Filter by Domain",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?domain=Tech",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "domain",
                  "value": "Tech",
                  "description": "Filter by domain. Accepted values: 'Tech' or 'Non-Tech'"
                }
              ]
            },
            "description": "Returns only registrations matching the specified domain. domain must be exactly 'Tech' or 'Non-Tech'."
          },
          "response": []
        },
        {
          "name": "Get Registrations — Search by Name or Email",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?search=priya",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "search",
                  "value": "priya",
                  "description": "Partial text match against name, email, or registrationId"
                }
              ]
            },
            "description": "Searches registrations by partial name, email, or registration ID."
          },
          "response": []
        },
        {
          "name": "Get Registrations — Filter by College",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?college=IIT",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "college",
                  "value": "IIT",
                  "description": "Partial case-insensitive match on college name"
                }
              ]
            },
            "description": "Filters registrations by college name using a partial case-insensitive match."
          },
          "response": []
        },
        {
          "name": "Get Registrations — Combined Filters",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/registrations?search=sharma&college=IIT&domain=Tech",
              "host": ["{{baseUrl}}"],
              "path": ["api", "registrations"],
              "query": [
                {
                  "key": "search",
                  "value": "sharma"
                },
                {
                  "key": "college",
                  "value": "IIT"
                },
                {
                  "key": "domain",
                  "value": "Tech"
                }
              ]
            },
            "description": "Demonstrates using all three filters simultaneously: search, college, and domain."
          },
          "response": []
        }
      ]
    },
    {
      "name": "Admin — Analytics",
      "item": [
        {
          "name": "Get Analytics",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/analytics",
              "host": ["{{baseUrl}}"],
              "path": ["api", "analytics"]
            },
            "description": "Returns aggregated analytics: total registrations, Tech vs Non-Tech domain split, and a day-by-day registration count array (used to render the bar chart in the admin dashboard)."
          },
          "response": [
            {
              "name": "200 OK",
              "status": "OK",
              "code": 200,
              "body": "{\n  \"totalRegistrations\": 42,\n  \"domainSplit\": {\n    \"tech\": 28,\n    \"nonTech\": 14\n  },\n  \"dailyRegistrations\": [\n    { \"date\": \"2026-03-10\", \"count\": 5 },\n    { \"date\": \"2026-03-11\", \"count\": 12 },\n    { \"date\": \"2026-03-12\", \"count\": 25 }\n  ]\n}"
            },
            {
              "name": "401 Unauthorized",
              "status": "Unauthorized",
              "code": 401,
              "body": "{\n  \"message\": \"Unauthorized\"\n}"
            }
          ]
        }
      ]
    }
  ]
}
```

---

## What This Project Demonstrates

• Clean separation of frontend, backend, and shared layers  
• RESTful API design with proper HTTP status codes  
• Database schema design and normalization  
• Secure JWT-based authentication  
• Robust validation and error handling  
• Scalable full-stack architecture

---

> **Note:** The live demo may show only the main page if the database connection on Render is expired or unavailable. For full functionality, please run the project locally with your own database.