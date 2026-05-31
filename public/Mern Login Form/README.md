MERN Login Form 🔐

A full-stack authentication system built with MongoDB, Express, React, and Node.js.

This project is a complete MERN stack authentication application featuring user registration, login, secure password hashing, JWT authentication, protected routes, and modern frontend integration using React.

📌 Features

🔐 User Registration & Login
🛡️ JWT Authentication
🔑 Password Hashing with bcrypt
🚪 Protected Routes
⚡ REST API using Express.js
🌐 MongoDB Database Integration
🎨 Responsive React Frontend
📦 Axios API Requests
🍪 Token Storage & Session Handling
❌ Error Handling & Validation
📱 Mobile-Friendly UI
🛠️ Tech Stack

Technology Usage

MongoDB Database
Express.js Backend Framework
React.js Frontend Library
Node.js Runtime Environment
JWT Authentication
bcrypt.js Password Hashing
Axios API Communication
React Router DOM Routing
dotenv Environment Variables

📂 Project Structure

# 📂 Project Structure

```text
mern-login-form/
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   └── authRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── Main/
│   │       ├── logo.png
│   │       └── banner.jpg
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── App.js
│   │   └── main.jsx
│   │
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/your-username/mern-login-form.git
cd mern-login-form

🚀 Backend Setup

Navigate to Backend
cd backend
Install Dependencies
npm install
Create .env File
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Start Backend Server
npm run server

Server runs on:

http://localhost:5000

💻 Frontend Setup
Navigate to Frontend
cd frontend
Install Dependencies
npm install
Start React App
npm start

Frontend runs on:

http://localhost:3000

🔑 API Endpoints

Register User
POST /api/auth/register
Request Body
{
"name": "John Doe",
"email": "john@example.com",
"password": "123456"
}
Login User
POST /api/auth/login
Request Body
{
"email": "john@example.com",
"password": "123456"
}
Get Protected User Data
GET /api/auth/user
Headers
Authorization: Bearer <token>

🔒 Authentication Flow

User registers with email & password
Password is hashed using bcrypt
JWT token is generated on login
Token is stored on frontend
Protected routes verify JWT
Authorized users gain access

Tiny cryptographic rituals standing between civilization and someone logging in as admin123.

🧠 Core Packages Used
Backend
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
Development Dependencies
npm install nodemon --save-dev
Frontend
npm install axios react-router-dom
📸 Screenshots
Login Page

Add screenshot here:

/frontend/screenshots/login.png
Register Page

Add screenshot here:

/frontend/screenshots/register.png
Dashboard

Add screenshot here:

/frontend/screenshots/dashboard.png

🌍 Environment Variables
Variable Description
PORT Backend Port
MONGO_URI MongoDB Connection URL
JWT_SECRET Secret Key for JWT

✅ Future Improvements

🔄 Refresh Tokens
📧 Email Verification
🔐 Forgot Password Feature
🌙 Dark Mode
👤 Profile Management
🔑 OAuth Authentication (Google/GitHub)
🧪 Unit & Integration Testing
☁️ Deployment with Docker & CI/CD
🚀 Deployment

Frontend Deploy using:

Vercel
Netlify

Backend Deploy using:

Render
Railway
Database

Use:

MongoDB Atlas

🤝 Contributing

Contributions are welcome.

Fork the project
Create your feature branch
git checkout -b feature/AmazingFeature
Commit your changes
git commit -m "Add some AmazingFeature"
Push to the branch
git push origin feature/AmazingFeature
Open a Pull Request

⭐ Support

If you found this project useful:

⭐ Star the repository
🍴 Fork the project
🛠️ Build something cool with it
