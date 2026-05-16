# Voting Application

A full-stack voting application with user authentication, candidate management, and live election results.

## Features

- User signup and login (Aadhar-based authentication)
- Cast vote (one vote per user)
- View live election results with visual bar charts
- Admin panel to add/delete candidates
- Change password
- Responsive dark-themed UI

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, JWT, bcrypt
- **Frontend:** Vanilla JavaScript, CSS (no frameworks)

## Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=3000
MONGODB_URL_LOCAL=mongodb://localhost:27017/voting_app
JWT_SECRET=your_super_secret_key_here
```

Start the server:
```bash
cd server
node server.js
```

### Frontend Setup
Open `frontend/index.html` in a browser (or serve via Live Server).

**Note:** The frontend expects the backend at `http://localhost:3000`. Update `API_BASE` in `frontend/script.js` if needed.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/user/signup` | No | Register new user |
| POST | `/user/login` | No | Login, returns JWT |
| GET | `/user/profile` | JWT | Get user profile |
| PUT | `/user/profile/password` | JWT | Change password |
| GET | `/candidate` | No | List all candidates |
| POST | `/candidate` | JWT+Admin | Add candidate |
| PUT | `/candidate/:id` | JWT+Admin | Update candidate |
| DELETE | `/candidate/:id` | JWT+Admin | Delete candidate |
| POST | `/candidate/vote/:id` | JWT | Cast vote |
| GET | `/candidate/vote/count` | No | Get vote counts |

## Screenshots

*Add screenshots here*
