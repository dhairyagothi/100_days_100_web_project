<div align="center">
...
</div>

<!-- markdownlint-enable MD033 -->

# 🇮🇳 BharatYatra

India-to-Global Tourism Platform

Journey to the Soul of the World!

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.x-880000?style=flat-square)](https://mongoosejs.com)
[![Vanilla JS](https://img.shields.io/badge/Frontend-Vanilla%20JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-E8622A?style=flat-square)](LICENSE)

A production-ready **MERN-stack** web application connecting global travelers to India's most extraordinary destinations — Spiritual sanctuaries, Ancient heritage, and Carbon-neutral Eco-tourism.

</div>

---

## 📖 Table of Contents

- [What is BharatYatra?](#-what-is-bharatyatra)
- [Tech Stack] (#-tech-stack)
- [How It Works] (#-how-it-works)
- [Project Structure](#-project-structure)
- [Getting Started (Fork & Run)](#-getting-started-fork--run)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database & Auto-Seeding](#-database--auto-seeding)
- [Frontend Architecture](#-frontend-architecture)
- [Features](#-features)
- [Design System](#-design-system)
- [Contributing](#-contributing)

---

## 🌏 What is BharatYatra?

**BharatYatra** (भारतयात्रा — *Journey through India*) is a full-stack tourism platform built to position India as a world-class destination for:

- 🕉️ **Spiritual Wellness** — Yoga, Ayurveda, ancient meditation traditions
- 🌿 **Carbon-Neutral Eco-Tourism** — UNESCO biodiversity hotspots and jungle lodges
- 🏛️ **Accessible Ancient Heritage** — 5,000 years of living civilisation

The backend is a **Node.js + Express REST API** backed by **MongoDB**. The frontend is intentionally built in **pure HTML/CSS/JS** (no React, no bundler) for maximum performance — the Express server serves everything statically from a single process.

---

## 🛠️ Tech Stack

| Layer         | Technology                             | Why                                     |
|---------------|----------------------------------------|-----------------------------------------|
| **Runtime**   | Node.js ≥ 18                           | LTS, native fetch, ESM support          |
| **Framework** | Express 4.x                            | Minimal, fast, battle-tested            |
| **Database**  | MongoDB (local or Atlas)               | Flexible schema for travel data         |
| **ODM**       | Mongoose 8.x                           | Schema validation, virtuals, population |
| **Frontend**  | Vanilla HTML5 / CSS3 / JS              | Zero bundle overhead, instant load      |
| **Fonts**     | Google Fonts (Playfair Display + Jost) | Distinctive heritage aesthetic          |
| **Dev tool**  | Nodemon                                | Auto-restart on file change             |

---

## ⚙️ How It Works

```bash
Browser Request
      │
      ▼
┌─────────────────────────────────────────────────────┐
│                  Express Server                      │
│                  (server.js :5000)                   │
│                                                     │
│  ┌──────────────────┐   ┌────────────────────────┐  │
│  │  Static Middleware│   │      API Router         │  │
│  │  /frontend/public │   │  /api/destinations      │  │
│  │                  │   │  /api/bookings           │  │
│  │  index.html  ────┼───┼▶ destinationRoutes.js   │  │
│  │  css/styles.css  │   │  bookingRoutes.js        │  │
│  │  js/app.js       │   └──────────┬─────────────┘  │
│  └──────────────────┘              │                 │
└───────────────────────────────────┼─────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │   Mongoose Models      │
                        │   Destination.js       │
                        │   Booking.js           │
                        └───────────┬───────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │       MongoDB          │
                        │  bharatyatra database  │
                        │                        │
                        │  collections:          │
                        │  • destinations        │
                        │  • bookings            │
                        └───────────────────────┘
```

**Request lifecycle — Fetching destinations:**

```bash
1. Browser loads index.html from Express static middleware
2. app.js runs → DOMContentLoaded fires
3. fetch('/api/destinations') hits Express
4. destinationRoutes.js queries MongoDB via Mongoose
5. If DB is empty → auto-seeds 3 destinations first
6. JSON response → app.js renders destination cards into the DOM
7. Booking dropdown is also populated from the same response
```

**Request lifecycle — Submitting a booking:**

```bash
1. User fills form → clicks "Reserve My Journey"
2. app.js validates fields client-side (email, date, count)
3. POST fetch('/api/bookings') with JSON body
4. bookingRoutes.js validates destination exists in DB
5. Validates travel date is in the future
6. Mongoose creates Booking document → returns populated data
7. Success/error alert rendered in the form UI
```

---

## 📂 Project Structure

```bash
bharatyatra/
│
├── README.md                         ← You are here
│
├── backend/                          ← Node.js + Express server
│   ├── .env                          ← Environment variables (never commit this)
│   ├── server.js                     ← App entry point
│   ├── package.json                  ← Dependencies & scripts
│   │
│   ├── config/
│   │   └── db.js                     ← Mongoose connection with reconnect handling
│   │
│   ├── models/
│   │   ├── Destination.js            ← Schema: title, region, category, image, globalAppeal
│   │   └── Booking.js                ← Schema: email, destinationId, travelers, date, status
│   │
│   └── routes/
│       ├── destinationRoutes.js      ← GET /api/destinations  (+ seed logic on startup)
│       └── bookingRoutes.js          ← POST /api/bookings · GET /api/bookings
│
└── frontend/
    └── public/                       ← Served statically by Express
        ├── index.html                ← Full single-page layout (hero, grid, form, footer)
        ├── css/
        │   └── styles.css            ← CSS variables, grid, animations, responsive
        └── js/
            └── app.js                ← Fetch, render cards, booking form, filter pills
```

> **Why no `src/` or build step?**
> The frontend is intentionally framework-free. Express points `express.static` at `frontend/public/` — the browser gets raw `.html`, `.css`, `.js` files with no transpilation, no bundler, no build command. This means **instant cold start** and zero toolchain complexity.

---

## 🚀 Getting Started (Fork & Run)

### Step 1 — Fork & Clone

Click **Fork** on GitHub, then:

```bash
git clone https://github.com/<your-username>/bharatyatra.git
cd bharatyatra
```

### Step 2 — Prerequisites

Make sure you have:

```bash
node --version   # must be v18.0.0 or higher
npm --version    # comes with Node
mongod --version # MongoDB Community Server, OR use Atlas (cloud)
```

> **Don't have MongoDB locally?** Use [MongoDB Atlas free tier](https://www.mongodb.com/cloud/atlas/register) — grab the connection string and paste it into `.env`. No local install needed.

### Step 3 — Install Dependencies

```bash
cd backend
npm install
```

That's the only `npm install` you need. The frontend has no dependencies.

### Step 4 — Configure Environment

The `.env` file already exists in `backend/` with sensible defaults:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bharatyatra
NODE_ENV=development
```

**Using MongoDB Atlas?** Replace `MONGO_URI`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bharatyatra?retryWrites=true&w=majority
```

### Step 5 — Run

```bash
# From inside backend/

npm run dev      # Development — auto-restarts on file changes (uses nodemon)
npm start        # Production — plain node
```

### Step 6 — Open the App

```bash
http://localhost:5000
```

On first run, the server will print:

```bash
✅ MongoDB Connected: localhost
🌱 Database seeded with 3 initial destinations.
🚀 BharatYatra Server running on http://localhost:5000
```

The three seed destinations (Varanasi, Western Ghats, Hampi) will appear in the grid automatically.

---

## 🔐 Environment Variables

| Variable    | Default                                 | Description                       |
|-------------|-----------------------------------------|-----------------------------------|
| `PORT`      | `5000`                                  | Port Express listens on           |
| `MONGO_URI` | `mongodb://localhost:27017/bharatyatra` | MongoDB connection string         |
| `NODE_ENV`  | `development`                           | Set to `production` on deployment |

> ⚠️ Never commit `.env` to version control. Add it to `.gitignore` before pushing your fork.

```bash
echo "backend/.env" >> .gitignore
```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### `GET /api/destinations`

Returns all destinations, sorted by rating (highest first).

**Optional query parameters:**

| Param      | Example               | Effect                         |
|------------|-----------------------|--------------------------------|
| `category` | `?category=Spiritual` | Exact match filter             |
| `region`   | `?region=Kerala`      | Case-insensitive partial match |

**Example request:**

```bash
curl http://localhost:5000/api/destinations
curl http://localhost:5000/api/destinations?category=Eco-Tourism
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "title": "Varanasi",
      "region": "Uttar Pradesh, North India",
      "description": "One of the world's oldest continuously inhabited cities...",
      "image": "https://images.unsplash.com/...",
      "category": "Spiritual",
      "globalAppeal": "A UNESCO-recognized cradle of civilization...",
      "rating": 4.8,
      "bestTimeToVisit": "October – March",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/bookings`

Creates a new reservation. No payment taken — status defaults to `"Pending"`.

**Request body:**

```json
{
  "userEmail": "traveler@example.com",
  "destinationId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "travelersCount": 2,
  "travelDate": "2025-11-15",
  "specialRequests": "Vegetarian meals, wheelchair access"
}
```

**Validation rules:**

- `userEmail` — valid email format, required
- `destinationId` — must exist in the `destinations` collection
- `travelersCount` — integer, 1–50
- `travelDate` — must be a future date
- `specialRequests` — optional, max 500 chars

**Success response (`201`):**

```json
{
  "success": true,
  "message": "🎉 Your journey to Varanasi has been reserved! Confirmation will be sent to traveler@example.com.",
  "data": {
    "_id": "...",
    "userEmail": "traveler@example.com",
    "destinationId": { "title": "Varanasi", "region": "...", "category": "Spiritual" },
    "travelersCount": 2,
    "travelDate": "2025-11-15T00:00:00.000Z",
    "status": "Pending"
  }
}
```

**Error response (`400`):**

```bash
{
  "success": false,
  "message": "Travel date must be a future date."
}
```

---

### `GET /api/bookings`

Returns all bookings with destination details populated. Useful for an admin dashboard.

```bash
curl http://localhost:5000/api/bookings
```

---

### `GET /api/health`

Quick liveness check.

```bash
curl http://localhost:5000/api/health
# → { "status": "OK", "message": "BharatYatra API is running", "timestamp": "..." }
```

---

## 🌱 Database & Auto-Seeding

The first time `destinationRoutes.js` is loaded, it runs `seedIfEmpty()`:

```bash
Server starts
     │
     ▼
destinationRoutes.js loads
     │
     ▼
Destination.countDocuments()
     │
     ├── count > 0 → skip, continue normally
     │
     └── count === 0 → insertMany(seedDestinations)
                            │
                            ├── Varanasi        (Spiritual)
                            ├── Western Ghats   (Eco-Tourism)
                            └── Hampi           (Heritage)
```

To reset the database and re-seed:

```bash
# Drop the collection in Mongo shell
mongosh bharatyatra --eval "db.destinations.drop()"

# Restart the server — seeds automatically
npm run dev
```

---

## 🎨 Frontend Architecture

The frontend is a **single HTML file + one CSS file + one JS file**. No framework, no build step.

```bash
frontend/public/
│
├── index.html      Sections: navbar → hero → filter bar → destinations grid
│                             → why india → booking form → footer
│
├── css/styles.css  CSS custom properties (--saffron, --gold, --ink)
│                   Grid: repeat(auto-fit, minmax(320px, 1fr))
│                   Animations: card hover scale, skeleton shimmer,
│                               mandala spin, particle float, scroll reveal
│
└── js/app.js       Modules (all vanilla):
                    • initNavbar()          — scroll shadow + mobile menu
                    • initHeroParticles()   — 30 animated floating dots
                    • fetchDestinations()   — async fetch → render cards
                    • renderDestinations()  — DOM card generation (XSS-safe)
                    • initFilterPills()     — category filter state
                    • populateDestinationDropdown() — booking select sync
                    • initTravelersCounter()        — +/− counter widget
                    • submitBooking()       — POST with loading state
                    • showFormAlert()       — success/error UI feedback
                    • initScrollReveal()    — IntersectionObserver reveals
```

**Data flow diagram:**

```bash
DOMContentLoaded
      │
      ├──▶ initNavbar()
      ├──▶ initHeroParticles()
      ├──▶ initFilterPills()
      ├──▶ initTravelersCounter()
      ├──▶ initMinTravelDate()
      ├──▶ initBookingForm()
      ├──▶ initScrollReveal()
      │
      └──▶ fetchDestinations()
                  │
                  ├──▶ Show skeleton cards
                  ├──▶ GET /api/destinations
                  ├──▶ renderDestinations(data)   → destination card DOM nodes
                  └──▶ populateDestinationDropdown(data) → booking <select>
```

---

## ✨ Features

| Feature                        | How it works                                                     |
|--------------------------------|------------------------------------------------------------------|
| **Auto-seed on first run**     | `destinationRoutes.js` calls `seedIfEmpty()` at module load      |
| **Category filter pills**      | Client-side filter on `state.destinations` array, no extra fetch |
| **Skeleton loading**           | CSS `shimmer` animation shown while fetch is in flight           |
| **Card hover animation**       | `transform: translateY(-8px) scale(1.01)` + shadow on `:hover`   |
| **Booking counter widget**     | JS `+/−` buttons update a readonly `<input type="number">`       |
| **Client + server validation** | JS validates before fetch; Mongoose validates on save            |
| **XSS protection**             | `escapeHtml()` escapes all API data before injecting into DOM    |
| **Scroll reveal**              | `IntersectionObserver` fades elements in as they enter viewport  |
| **Mandala animation**          | SVG `rotate` keyframe — pure CSS, no JS                          |
| **Mobile hamburger menu**      | CSS class toggle, no library                                     |
| **SPA fallback route**         | `app.get('*')` serves `index.html` for any unknown path          |

---

## 🎨 Design System

| Token            | Value     | Usage                               |
|------------------|-----------|-------------------------------------|
| `--saffron`      | `#E8622A` | Primary CTA, accents, category tags |
| `--saffron-dark` | `#C44E1A` | Hover states                        |
| `--gold`         | `#D4A017` | Stars, mandala petals               |
| `--ink`          | `#0F0E0C` | Headings, body text                 |
| `--mist`         | `#F5F2ED` | Section backgrounds                 |
| `--cream`        | `#FAF8F4` | Page background                     |

**Typography:**

- Display / headings → `Playfair Display` (serif, italic flair)
- Body / UI → `Jost` (geometric sans-serif, clean at small sizes)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/add-adventure-destinations`
3. Commit your changes: `git commit -m 'feat: add Ladakh adventure destination'`
4. Push to your fork: `git push origin feature/add-adventure-destinations`
5. Open a Pull Request

**Ideas for contributions:**

- Add more destinations (Ladakh, Rann of Kutch, Andaman Islands)
- Build an admin panel to manage destinations via the API
- Add user authentication (JWT) to persist bookings per account
- Implement email confirmation via Nodemailer
- Add image upload support via Cloudinary

---

## 📜 License

MIT © 2024 BharatYatra

---

<div align="center">

*अतिथि देवो भव — The Guest is God*

Made with ❤️ in India, for the World.

</div>