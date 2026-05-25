# 📚 Advanced URL Shortener - Documentation

---

## 📌 Overview

This project is a full-stack **Advanced URL Shortener** built using modern web technologies.

It supports:

* Secure link generation
* Password-protected URLs
* Analytics tracking
* Expiry-based links
* Authentication system

---

## 🏗️ System Architecture

The application follows a **client-server architecture**:

* **Frontend:** React (UI + API calls)
* **Backend:** Node.js + Express (REST API)
* **Database:** MongoDB (data storage)

### Flow:

1. User sends request from frontend
2. Backend processes request
3. Data stored in MongoDB
4. Response sent back to frontend

---

## 🔗 URL Shortening Flow

1. User enters original URL
2. Backend generates unique `shortcode` (NanoID)
3. Data stored in database
4. Short URL returned

### Example:

```
Input: https://example.com/long-url
Output: https://domain.com/abc123
```

---

## 🔐 Authentication System

* JWT-based authentication
* Token stored on client side
* Protected routes require valid token

### Flow:

1. User logs in
2. Server generates JWT
3. Token sent to client
4. Client sends token in future requests

---

## 🔒 Security Features

* Password hashing using **bcrypt**
* Rate limiting to prevent abuse
* Protected routes using middleware
* Input validation on API level

---

## 📊 Analytics System

Tracks:

* Total clicks
* IP address
* Device type
* Timestamp

### Working:

* On every redirect → analytics updated
* Data stored in MongoDB

---

## ⏳ Expiry System

* User can set expiry time
* Backend checks expiry before redirect
* Expired links are disabled automatically

---

## 📡 API Structure

### Base URL

```
http://localhost:5000
```

---

### URL APIs

| Method | Endpoint               | Description      |
| ------ | ---------------------- | ---------------- |
| POST   | /api/shorten           | Create short URL |
| GET    | /:shortcode            | Redirect         |
| POST   | /api/verify/:shortcode | Verify password  |

---

### Auth APIs

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| POST   | signup | Register      |
| POST   | /login  | Login         |
| POST   | /api/logout | Logout        |
| GET    | /api/me     | Get user data |

---

### System API

| Method | Endpoint | Description         |
| ------ | -------- | ------------------- |
| GET    | /health  | Check server status |

---

## 🧩 Folder Structure Explanation

### Backend

* **controllers/** → Business logic
* **models/** → Database schemas
* **routes/** → API endpoints
* **middleware/** → Auth, validation
* **server.js** → Entry point

### Frontend

* **components/** → UI components
* **services/** → API calls
* **utils/** → Helper functions

---

## ⚙️ Environment Variables

### Backend

```
PORT=5000
MONGO_URI=your_connection
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
```

### Frontend

```
REACT_APP_BASE_URL=http://localhost:5000
```

---

## 🚀 Deployment Details

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

---

## ❗ Known Limitations

* Analytics may be inaccurate with VPN users
* No caching layer implemented
* Not optimized for high-scale traffic yet

---

## 📌 Future Scope

* Advanced analytics dashboard
* Admin panel
* Team collaboration
* Caching (Redis)
* Load balancing

---

## 🧠 Key Learnings

* REST API design
* Authentication (JWT)
* Database modeling
* Full-stack integration
* Deployment workflows

---

## 📄 License

MIT License