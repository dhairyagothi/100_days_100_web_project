# 🚀 Smart & Advanced URL Shortener

A modern and scalable URL shortener built with a full-stack JavaScript ecosystem. This project goes beyond basic link shortening by integrating authentication, analytics, and advanced security features.

It is designed to simulate real-world production systems with proper backend architecture, API handling, and deployment practices. The application focuses on performance, reliability, and user experience.

With features like protected links, expiry control, and uptime monitoring, this project demonstrates practical implementation of industry-level concepts in a clean and structured way.


![License](https://img.shields.io/badge/license-MIT-green)
<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Author-Chandan%20Koranga-orange?style=for-the-badge" />
</p>


 ## 🔗 Live Demo
- 🌐 Frontend: [https://url.appnests.in](https://www.url.appnests.in)
- ⚙️ Backend API: [https://api.chandankoranga.in](https://www.api.chandankoranga.in)


 ## 💡 Why This Project?

Most URL shorteners only generate links.
This system goes beyond that:

- 🔐 Secure sharing using password-protected links  
- 📊 Track user behavior with analytics  
- ⏳ Control link lifecycle with expiry  
- 🚫 Prevent abuse using rate limiting  
- 👤 Full authentication system (JWT-based)

👉 This is built like a real product, not just a feature demo.
🌟 Core Features<br>

 ### 🔗 URL Management
- Generate short links instantly<br>
- Custom aliases support<br>
- Fast redirection system<br>

### 🔒 Security Layer
- Password-protected URLs<br>
- JWT authentication<br>
- Bcrypt hashing<br>
- Rate limiting against abuse<br>

### 📊 Analytics Engine
Click tracking system<br>
- IP-based logging<br>
- Device tracking<br>
- Real-time click count updates<br>

### ⏳ Smart Controls
- Expiry-based links<br>
- Auto-disable expired URLs<br>
  
### 📱 Extras
- QR Code generation<br>
- Clean UI for user interaction<br>

## 📸 Screenshots

### 🏠 Home Page
<p align="center">
  <img src="assets/home.png" width="80%" />
</p>

---

### 🔗 Shortened URL Result
<p align="center">
  <img src="assets/result.png" width="80%" />
</p>

---

### 🔐 Login Page
<p align="center">
  <img src="assets/login.png" width="80%" />
</p>


## 🧠 Security

| Feature     | Description                  | Status |
|------------|------------------------------|--------|
| Auth       | JWT based authentication     | ✅     |
| Analytics  | Click tracking system        | ✅     |
| Security   | Password + Rate limiting     | ✅     |



## 🧠 Tech Stack

| Layer     | Technology |
|----------|-----------|
| Frontend | React, Tailwind CSS |
| Backend  | Node.js, Express.js |
| Database | MongoDB |
| Auth     | JWT |
| Hosting  | Render, Vercel |
| Domain   | GoDaddy |

---


<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="60" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="60" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png" width="60" />
</p>

## 🏗️ Architecture

- RESTful API design
- MVC pattern (controllers, routes, models)
- Client-server architecture
- Stateless authentication using JWT
- Middleware-based request handling


## 📁 Project Structure

```
URL_shortener/
│
├── backend/
│   ├── controllers/        # Business logic (shorten, redirect, analytics)
│   ├── middleware/         # Auth, rate limiting, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route handlers
│   │   ├── auth.routes.js
│   │   ├── link.routes.js
│   │   └── redirect.routes.js
│   ├── public/             # Static assets (if any)
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API calls
│   │   ├── utils/          # Helper functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```
## ⚙️ Installation & Setup

```bash
# Clone repo
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Backend setup
cd backend
npm install
npm start

# Frontend setup
cd ../frontend
npm install
npm start
```

## 🔐 Environment Variables

### 🖥️ Backend (`/backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
```

---

### 🌐 Frontend (`/frontend/.env`)

```env
REACT_APP_BASE_URL=http://localhost:5000
```

## 📊 API Endpoints

### 🔗 URL Management

| Method | Endpoint              | Description |
|--------|----------------------|------------|
| POST   | /api/shorten         | Create a short URL |
| GET    | /:shortcode          | Redirect to original URL |
| POST   | /api/verify/:shortcode | Verify password for protected link |

---

### 👤 Authentication

| Method | Endpoint        | Description |
|--------|----------------|------------|
| POST   | /signup     | Register new user |
| POST   | /login      | Login user |
| POST   | /api/logout     | Logout user |
| GET    | /api/me         | Get current logged-in user data |

---

### ⚙️ System

| Method | Endpoint   | Description |
|--------|-----------|------------|
| GET    | /health   | Check server uptime / health status |


## 🌐 Browser Support

| Browser           | Support |
|------------------|--------|
| Chrome           | ✅ Fully Supported |
| Firefox          | ✅ Fully Supported |
| Edge             | ✅ Fully Supported |
| Safari           | ✅ Supported |
| Mobile Browsers  | ✅ Supported |

## 🔐 Privacy Policy

- No unnecessary user data is stored  
- Passwords are securely hashed using **bcrypt**  
- JWT is used for secure authentication  
- No third-party tracking scripts are used  
- Analytics data is used internally only  

---

## 💡 Tips for Best Results

- Use **custom aliases** for better branding  
- Set **expiry dates** for temporary links  
- Protect sensitive links using **passwords**  
- Monitor analytics to understand user behavior  
- Avoid spamming (rate limits लागू होंगे)  

---

## 🚀 Deployment

- **Frontend:** Vercel  
- **Backend:** Render / Railway  
- **Database:** MongoDB Atlas  

---

## 📌 Future Improvements

- Advanced analytics dashboard  
- User link management panel  
- Team collaboration features  
- API usage monitoring system

## 👨‍💻 Author

<p align="center">
  <img src="https://github.com/chandankoranga02.png" width="120" style="border-radius:50%" />
</p>

<p align="center">
  <b>Chandan Koranga</b>
</p>

---

## 📄 License

This project is licensed under the **MIT License** — free for personal and commercial use.

---

## ❗ Known Limitations

- Analytics accuracy may vary with VPN users  
- No caching layer implemented (future improvement)  
- Limited scalability without load balancing

## 🤝 Contributing

Pull requests are welcome.  
For major changes, please open an issue first to discuss.

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!

## ⭐ Final Note

This project reflects:

- Real backend architecture  
- Secure authentication practices  
- Scalable system design  

👉 Built to demonstrate **industry-level full-stack capability**, not just CRUD skills.

