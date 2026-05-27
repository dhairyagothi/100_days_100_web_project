# Job Board — Full-Stack Web Application

A complete full-stack job board application built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend). Features job listings with search/filter, job detail pages, application submission with resume upload, and a full admin panel behind JWT authentication.

## 🛠 Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18, Vite, React Router v6, Axios      |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB with Mongoose ODM                   |
| Auth       | JWT (JSON Web Tokens) + bcryptjs            |
| File Upload| Multer (resume PDF/DOC)                     |
| Styling    | Vanilla CSS (warm yellow/black theme)       |
| Icons      | Font Awesome 5, React Icons                 |
| Notifications | React Hot Toast                          |

## 📋 Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **MongoDB** — either:
  - Local install ([download](https://www.mongodb.com/try/download/community))
  - Or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier (cloud)

## 🚀 Setup Instructions

### 1. Configure Environment

```bash
# In the server/ directory, edit .env
cd server
# Edit .env with your MongoDB connection string:
# MONGODB_URI=mongodb://localhost:27017/jobboard    (local)
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jobboard  (Atlas)
```

### 2. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **32 jobs** across 6 categories (Engineering & Development, Data AI & ML, Operations Cloud & Infrastructure, QA & Testing, Design & UX, Management & Strategy)
- **1 admin account**: `admin@jobboard.com` / `admin123`

### 4. Start the Application

Open **two terminals**:

```bash
# Terminal 1: Start backend (port 5000)
cd server
npm run dev

# Terminal 2: Start frontend (port 5173)
cd client
npm run dev
```

### 5. Open in Browser

- **Job Board**: [http://localhost:5173](http://localhost:5173)
- **Admin Login**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **API Health**: [http://localhost:5000](http://localhost:5000)

## 🔑 Default Admin Credentials

| Field    | Value                |
|----------|----------------------|
| Email    | admin@jobboard.com   |
| Password | admin123             |

## 📡 API Endpoints

| Method | Endpoint              | Auth   | Description                          |
|--------|-----------------------|--------|--------------------------------------|
| GET    | `/api/jobs`           | Public | List jobs (with filter/sort params)  |
| GET    | `/api/jobs/:id`       | Public | Get single job                       |
| POST   | `/api/jobs`           | Admin  | Create new job                       |
| PUT    | `/api/jobs/:id`       | Admin  | Update job                           |
| DELETE | `/api/jobs/:id`       | Admin  | Soft-delete job                      |
| POST   | `/api/apply/:jobId`   | Public | Submit application (multipart form)  |
| GET    | `/api/applications`   | Admin  | List all applications                |
| POST   | `/api/admin/login`    | Public | Admin login → JWT token              |

### Filter Query Parameters (`GET /api/jobs`)

| Param       | Example                        | Description                              |
|-------------|-------------------------------|------------------------------------------|
| title       | `?title=developer`            | Search by title or company (partial)     |
| category    | `?category=Engineering`       | Exact match on category                  |
| location    | `?location=mumbai`            | Search by location (partial)             |
| jobType     | `?jobType=full-time`          | Exact match (full-time/internship/etc.)  |
| shift       | `?shift=day+shift`            | Exact match on shift                     |
| education   | `?education=bachelor`         | Partial match on education               |
| salary      | `?salary=50000-100000`        | Range: salaryMax>=min AND salaryMin<=max |
| salary      | `?salary=500000-Infinity`     | Open-ended upper range (5 lakh+)         |
| datePosted  | `?datePosted=7`               | Jobs posted within last N days           |
| sortBy      | `?sortBy=salary_asc`          | salary_asc / salary_desc / newest / title_az |

## 📁 Project Structure

```
Job dashboard/
├── server/                     # Express API
│   ├── config/db.js            # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # JWT verification
│   │   └── upload.js           # Multer file upload
│   ├── models/
│   │   ├── Job.js              # Job schema
│   │   ├── Application.js      # Application schema
│   │   └── Admin.js            # Admin schema
│   ├── routes/
│   │   ├── jobs.js             # Job CRUD endpoints
│   │   ├── applications.js     # Apply + list applications
│   │   └── admin.js            # Admin login
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Express entry point
│   ├── .env                    # Environment variables
│   └── package.json
├── client/                     # React + Vite
│   ├── public/images/          # Company logo assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobFilter.jsx
│   │   │   ├── ApplyModal.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/
│   │   │   ├── JobsPage.jsx
│   │   │   ├── JobDetailPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminJobForm.jsx
│   │   │   └── AdminApplicants.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## ✨ Features

### Public
- 🔍 Job listing with search, filter (type, salary, shift, education, date) and sort
- 📄 Dynamic job detail pages (single route, database-driven)
- 📝 Apply with resume upload (PDF/DOC/DOCX)
- ❤️ Save/unsave jobs (localStorage)
- 📱 Fully responsive design

### Admin Panel
- 🔐 JWT-authenticated login
- 📊 Dashboard with job stats and applicant counts
- ➕ Add new jobs with full detail form
- ✏️ Edit existing jobs
- 🗑️ Delete jobs (soft-delete)
- 👥 View applicants per job with resume downloads

## 🎨 Design

The visual design preserves the original warm yellow (`rgb(247, 247, 178)`) and black button theme, enhanced with:
- Smooth card hover animations
- Glassmorphic navbar with backdrop blur
- Modal overlays for apply forms
- Fade-in animations on card load
- Responsive grid layout (3-column → 1-column)
