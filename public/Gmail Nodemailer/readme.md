Gmail Nodemailer 📧

A backend email service built with Node.js, Express.js, and Nodemailer for sending emails using Gmail SMTP. This project demonstrates how to configure and integrate email functionality into backend applications using a clean and scalable structure.


📌 Features

Send emails using Gmail SMTP
Express.js backend server
Secure environment variable configuration
REST API endpoint for email sending
Modular folder structure
Error handling and response management
Easy integration into full-stack applications


🛠️ Tech Stack

Technology	Usage
Node.js	Runtime Environment
Express.js	Backend Framework
Nodemailer	Email Service
dotenv	Environment Variables
CORS	Cross-Origin Requests


📂 Project Structure

```text
gmail-nodemailer/
├── node_modules/
│
├── config/
│   └── mailConfig.js
│
├── controllers/
│   └── mailController.js
│
├── routes/
│   └── mailRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```


⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/your-username/gmail-nodemailer.git
cd gmail-nodemailer

📦 Install Dependencies
npm install

🔐 Environment Variables
Create a .env file in the root directory:

PORT=5000

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password


🔑 Gmail App Password Setup

To use Gmail SMTP, follow these steps:

Open Google Account Security
Enable 2-Step Verification
Navigate to App Passwords
Generate a new App Password
Use the generated password as EMAIL_PASS


🚀 Start the Server
Development Mode
npm run dev
Production Mode
npm start

Server runs on:

http://localhost:5000

📜 Package.json Scripts
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

🧠 Main Server Configuration
server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mailRoutes = require("./routes/mailRoutes");

app.use("/api/mail", mailRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


⚙️ Nodemailer Configuration

config/mailConfig.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;


📧 Mail Controller
controllers/mailController.js
const transporter = require("../config/mailConfig");

const sendMail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
};

module.exports = { sendMail };



🛣️ Routes
routes/mailRoutes.js
const express = require("express");
const router = express.Router();

const { sendMail } = require("../controllers/mailController");

router.post("/send", sendMail);

module.exports = router;
📡 API Endpoint
Send Email
POST /api/mail/send
📨 Request Body Example
{
  "to": "example@gmail.com",
  "subject": "Test Email",
  "text": "Hello from Nodemailer"
}
✅ Success Response
{
  "success": true,
  "message": "Email sent successfully"
}
❌ Error Response
{
  "success": false,
  "message": "Failed to send email"
}



📦 Required Packages
npm install express nodemailer dotenv cors
Development Dependency
npm install nodemon --save-dev

🌍 Environment Variables
Variable	Description
PORT	Server Port
EMAIL_USER	Gmail Address
EMAIL_PASS	Gmail App Password


🚀 Future Improvements

HTML email templates
File attachments support
Bulk email functionality
OAuth2 authentication
Email logging system
Rate limiting and security middleware
Deployment with Docker


🌐 Deployment

You can deploy this backend using:

Render
Railway
Cyclic

🤝 Contributing

Contributions are welcome.

Fork the repository
Create a feature branch
git checkout -b feature/new-feature
Commit your changes
git commit -m "Add new feature"
Push to GitHub
git push origin feature/new-feature
Open a Pull Request


⭐ Support

If you found this project useful:

Star the repository
Fork the project
Contribute to improve the project
