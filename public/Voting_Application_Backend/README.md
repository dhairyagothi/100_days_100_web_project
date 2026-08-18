# 🗳️ Voting Application Backend

The Voting Application Backend is a RESTful API that powers the Voting Application. It manages user authentication, candidate management, vote submission, and data persistence while ensuring secure and efficient communication between the frontend and the database.

---

## ✨ Features

- 🔐 User authentication and authorization
- 🗳️ Vote casting functionality
- 👥 Candidate management
- 📊 Vote counting and result retrieval
- 🌐 RESTful API architecture
- ⚡ Fast and scalable backend
- 🔒 Secure request handling

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- dotenv

---

## 📂 Project Structure

```text
Voting_Application_backend/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
├── app.js
├── package.json
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Navigate to the project

```bash
cd Voting_Application_backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file and configure the required environment variables.

Start the server

```bash
npm start
```

---

## ⚙️ Environment Variables

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 📡 API Overview

Example endpoints:

- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/candidates`
- POST `/api/vote`
- GET `/api/results`

---

## ▶️ Usage

1. Configure environment variables.
2. Start the backend server.
3. Connect the frontend application.
4. Access the available API endpoints.

---

## 🔮 Future Enhancements

- Admin dashboard APIs
- Email verification
- Password reset
- Rate limiting
- API documentation using Swagger
- Docker support
- Unit and integration tests

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

## 📄 License

This project is part of the **100 Days 100 Web Projects** repository and is intended for educational purposes.