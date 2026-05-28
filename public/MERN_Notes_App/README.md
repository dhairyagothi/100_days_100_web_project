# 📝 MERN Notes App — Day 113

A full-stack Notes application built with the **MERN stack** (MongoDB, Express.js, React, Node.js).
Developed as part of the **100 Days 100 Web Projects** challenge.

## ✨ Features

- 🔐 User registration and login with **JWT Authentication**
- 📝 Create, Read, Update, Delete (CRUD) notes
- 🔒 Private notes — each user only sees their own
- 🔍 Real-time note search
- 📱 Fully responsive dark-themed UI
- 🛡️ Protected API routes with auth middleware

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose ODM              |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |

## 📁 Project Structure

```
MERN_Notes_App/
├── server/                 ← Express + MongoDB backend
│   ├── models/
│   │   ├── User.js        ← User schema with bcrypt
│   │   └── Note.js        ← Note schema
│   ├── routes/
│   │   ├── auth.js        ← Register / Login routes
│   │   └── notes.js       ← CRUD routes (protected)
│   ├── middleware/
│   │   └── auth.js        ← JWT verification middleware
│   ├── .env.example       ← Environment variable template
│   └── index.js           ← Express server entry point
└── client/                 ← React + Vite frontend
    └── src/
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   └── NoteCard.jsx
        └── pages/
            ├── Home.jsx
            └── Auth.jsx
```

## 🚀 How to Run Locally

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free tier works) OR local MongoDB

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/100_days_100_web_project.git
cd 100_days_100_web_project/public/MERN_Notes_App
```

### 2. Setup the server
```bash
cd server
npm install
cp .env.example .env
# ✏️  Edit .env with your MongoDB URI and a JWT secret
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup the client
```bash
cd ../client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Open in browser
Visit **http://localhost:5173** → Register → Start creating notes!

## 🔌 API Endpoints

| Method | Endpoint              | Auth     | Description         |
|--------|-----------------------|----------|---------------------|
| POST   | /api/auth/register    | Public   | Register new user   |
| POST   | /api/auth/login       | Public   | Login user          |
| GET    | /api/notes            | Private  | Get all user notes  |
| POST   | /api/notes            | Private  | Create a note       |
| PUT    | /api/notes/:id        | Private  | Update a note       |
| DELETE | /api/notes/:id        | Private  | Delete a note       |

## 👤 Author

Contributed by [@nishantnayakx](https://github.com/nishantnayakx)

---
*Part of [100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project)*
