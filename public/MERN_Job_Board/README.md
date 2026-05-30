# ⚡ MERN Real-time Job Board

A full-stack **Job Board** built with the MERN stack + **Socket.io** for real-time features.
Part of the **100 Days 100 Web Projects** challenge.

## ✨ Features

### Real-time (Socket.io)
- 🔴 New job listings appear **live** for all users without refresh
- 🔔 Employers get **instant notifications** when candidates apply
- 🟢 Live online user count in the navbar

### Employer Role
- Post job listings with tech stack tags
- Dashboard to manage listings and applicants
- Update application status (pending → reviewed → accepted/rejected)

### Candidate Role
- Browse and filter jobs by type and keyword
- Apply with cover letter — employer notified in real-time
- Dashboard to track all applications and status

## 🛠️ Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios  |
| Real-time | **Socket.io** (client + server)         |
| Backend   | Node.js, Express.js                     |
| Database  | MongoDB + Mongoose                      |
| Auth      | JWT + bcryptjs, Role-based (RBAC)       |

## 🚀 Run Locally

### Server
```bash
cd server
npm install
cp .env.example .env
# Edit .env: add your MongoDB URI and JWT secret
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | Public | Register (employer/candidate) |
| POST | /api/auth/login | Public | Login |
| GET | /api/jobs | Public | Browse jobs |
| POST | /api/jobs | Employer | Post new job |
| PUT | /api/jobs/:id | Employer | Edit job |
| DELETE | /api/jobs/:id | Employer | Delete job |
| POST | /api/applications/:jobId | Candidate | Apply |
| GET | /api/applications/my | Candidate | My applications |
| GET | /api/applications/job/:id | Employer | Job applicants |
| PUT | /api/applications/:id/status | Employer | Update status |

## ⚡ Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| newJob | Server→All | New job posted, added to board live |
| newApplication | Server→Employer | Candidate applied, toast notification |
| onlineCount | Server→All | Live count of connected users |

## 👤 Author
[@nishantnayakx](https://github.com/nishantnayakx) · Part of [100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project)
