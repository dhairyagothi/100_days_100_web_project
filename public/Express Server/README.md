# Express Server 🚀

A lightweight and modular backend server built with **Node.js** and **Express.js**.

This project demonstrates the fundamentals of backend development using Express.js, including routing, middleware, controller-based architecture, environment configuration, centralized response handling, and REST API development.

> Part of the **100 Days 100 Web Projects** collection.

---

## 🔗 Repository & Project Links

### Main Repository

https://github.com/dhairyagothi/100_days_100_web_project

### Project Showcase

https://100-days-100-web-project.vercel.app/

### Express Server Directory

https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Express%20Server

---

## 📖 About This Project

Unlike most projects in the repository that focus on frontend development, **Express Server** is a backend-oriented project designed to showcase Express.js server architecture and API development concepts.

This project focuses on:

- Express.js fundamentals
- REST API architecture
- Modular routing
- Middleware implementation
- Controller-based logic separation
- Environment configuration
- Standardized API responses
- Backend project organization

Since this is a backend project, it does not include a visual user interface. APIs can be tested using:

- Browser
- Postman
- Thunder Client
- Insomnia
- cURL

---

# ✨ Features

- ⚡ Express.js Server Setup
- 📂 Modular Folder Structure
- 🛣️ Express Router Integration
- 🎯 Controller-Based Request Handling
- 📝 Request Logging Middleware
- 🛡️ Global Error Handling Middleware
- 🌍 Environment Variable Support
- 📡 REST API Endpoints
- ❤️ Health Monitoring Endpoint
- 👥 Mock User Endpoint
- 🔄 Standardized JSON Responses

---

# 📁 Project Structure

```text
Express Server/
├── package.json
├── server.js
├── .gitignore
├── .env.example
│
├── routes/
│   └── apiRoutes.js
│
├── controllers/
│   └── apiController.js
│
├── middleware/
│   ├── loggerMiddleware.js
│   └── errorMiddleware.js
│
├── utils/
│   └── responseHandler.js
│
└── README.md
```

---

# 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript Runtime |
| Express.js | Backend Framework |
| Dotenv | Environment Variable Management |
| Nodemon | Development Server Reloading |

---

# ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### Navigate to Express Server

```bash
cd "public/Express Server"
```

### Install Dependencies

```bash
npm install
```

---

# 🔐 Environment Setup

Create a `.env` file in the project root.

Example:

```env
PORT=3000
NODE_ENV=development
```

Or copy values from:

```text
.env.example
```

---

# ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will run at:

```text
http://localhost:3000
```

---

# 🌐 API Endpoints

## Root Endpoint

### GET /

Returns API status.

Response:

```json
{
  "success": true,
  "message": "Express Server API is running successfully"
}
```

---

## Health Check

### GET /api/health

Returns server health information.

Response:

```json
{
  "success": true,
  "message": "Server health status fetched successfully",
  "data": {
    "uptime": 150.12,
    "timestamp": "2026-05-21T12:00:00.000Z"
  }
}
```

---

## Server Information

### GET /api/info

Returns server metadata.

Response:

```json
{
  "success": true,
  "message": "Server information fetched successfully",
  "data": {
    "project": "Express Server",
    "framework": "Express.js",
    "version": "1.0.0",
    "environment": "development"
  }
}
```

---

## Users Endpoint

### GET /api/users

Returns sample user data.

Response:

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

---

# 📝 Middleware

## Logger Middleware

Logs every incoming request.

Example:

```text
[2026-05-21T12:00:00.000Z] GET /api/users
```

---

## Error Middleware

Handles unexpected server errors and returns standardized responses.

Response:

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

# 🔄 Standardized API Responses

All endpoints follow a consistent response format:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Benefits:

- Better API consistency
- Easier frontend integration
- Improved maintainability
- Predictable response structure

---

# 🚀 Future Enhancements

Possible improvements:

- MongoDB Integration
- PostgreSQL Support
- JWT Authentication
- User Authentication System
- Request Validation
- Swagger API Documentation
- Unit Testing
- Docker Support
- Deployment Configuration

---

# 🎯 Learning Outcomes

This project helps developers understand:

- Express.js Fundamentals
- REST API Development
- Routing Architecture
- Middleware Design
- Error Handling
- Environment Variables
- Backend Project Structure
- API Response Standardization

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Commit using clear commit messages
5. Open a Pull Request

---


### ⭐ If you find this project useful, consider starring the repository:

https://github.com/dhairyagothi/100_days_100_web_project
