# 🚀 Express Server

> **Build Fast. Serve Clean.** — A clean, production-ready Express.js REST API server with a built-in live dashboard, structured middleware, and elegant error handling.

---

## ✨ Overview

Express Server is a lightweight and well-structured REST API backend built with Node.js and Express.js. It comes with a live dashboard, health check endpoints, request logging, global error handling, and a unified response helper — making it a solid foundation for any backend project.

Built as part of the **100 Days 100 Web Projects** challenge.

---

## 🚀 Features

### 🖥️ Live Dashboard
- Built-in dashboard UI served at `/`
- Beautiful custom 404 HTML page for unknown routes
- JSON fallback for API/browser requests

### 🔗 REST API Endpoints
- Health check endpoint with uptime info
- Server info and environment details
- Mock users API with full list and single user lookup by ID

### 🛡️ Middleware
- Global error handling middleware
- Colored request logger with duration tracking
- Clean and modular middleware structure

### 🧰 Utilities
- Unified JSON response helper for consistent API responses
- Environment-based configuration via `.env`
- `.env.example` for easy onboarding

### ⚡ Developer Experience
- Development mode with `nodemon` auto-restart
- Production-ready start script
- Clean and scalable folder structure

### 📱 Responsive Dashboard
- Desktop optimized
- Tablet friendly
- Mobile responsive

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Middleware
- Custom Error Middleware
- Custom Logger Middleware

### Tools & Config
- dotenv (`.env` configuration)
- nodemon (development server)
- npm (package manager)

---

## 📂 Project Structure

```bash
Express Server/
│
├── controllers/
│   └── apiController.js      # Route handlers
│
├── middleware/
│   ├── errorMiddleware.js     # Global error handler
│   └── loggerMiddleware.js    # Request logger (colored, with duration)
│
├── routes/
│   └── apiRoutes.js           # API route definitions
│
├── utils/
│   └── responseHandler.js     # Unified JSON response helper
│
├── public/
│   ├── index.html             # Live dashboard (served at /)
│   └── 404.html               # Beautiful 404 page
│
├── .env.example
├── package.json
└── server.js                  # Entry point
```

---

## ⚡ Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Clone the Repository

```bash
git clone https://github.com/your-username/express-server.git
```

### Navigate to Project Directory

```bash
cd express-server
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

### Start Development Server

```bash
npm run dev
```

### Start Production Server

```bash
npm start
```

---

## 🔗 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Dashboard UI |
| GET | `/api/health` | Health check + uptime |
| GET | `/api/info` | Server info + env |
| GET | `/api/users` | All mock users |
| GET | `/api/users/:id` | Single user by ID |

> Any unknown route returns a beautiful 404 HTML page, or JSON if the request expects JSON.

---

## 🎯 Future Enhancements

- Database integration (MongoDB / PostgreSQL)
- User authentication with JWT
- Rate limiting middleware
- Swagger / OpenAPI documentation
- Docker support for containerized deployment
- Unit and integration tests
- WebSocket support for real-time features
- Admin panel for live server monitoring

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 🌟 Acknowledgements

Inspired by clean backend architecture patterns with a focus on modularity, developer experience, and production readiness.

---

## 👩‍💻 Authors

| Role | Name |
|---|---|
| 💻 App Development | **Sanyogita Singh** |
| 📝 Documentation | **Sanyogita Singh** |

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

### 🚀 Express Server

**Build Fast. Serve Clean.**

Built with ❤️ and lots of coffee ☕

</div>