# Gmail Nodemailer 📧

A modern email sending backend built using **Node.js**, **Express.js**, and **Nodemailer** for sending emails using Gmail SMTP.

This project demonstrates how to securely integrate email functionality into backend applications while also providing a modern responsive frontend contact/subscription form with improved UI/UX and better developer experience.

The application allows users to submit their name and email through a responsive form interface and receive confirmation emails using Gmail SMTP integration.

---

# 📌 Features

## Backend Features

* Send emails using Gmail SMTP
* Express.js backend server
* Secure environment variable configuration
* Nodemailer integration
* Form handling using Express
* REST API-style email handling
* Error handling and response management
* JSON and form-data support
* Beginner-friendly project structure

## Frontend Features

* Responsive subscription/contact form UI
* Modern glassmorphism design
* Improved spacing and visual hierarchy
* Accessible labels and placeholders
* Input focus animations
* Hover effects and smooth transitions
* Mobile-friendly layout
* Improved typography and readability
* Dark-themed modern interface

---

# 🌙 UI Improvements Implemented

The frontend contact form was redesigned to improve usability, responsiveness, accessibility, and overall visual appearance.

## Improvements Added

* Improved dark-themed background design
* Added glassmorphism card effect
* Improved typography hierarchy
* Added accessible labels
* Improved spacing and alignment
* Added hover animations
* Added input focus effects
* Improved button styling
* Enhanced readability and contrast
* Improved responsive layout behavior
* Reduced excessive empty spacing

---

# 🛠️ Tech Stack

| Technology  | Usage                   |
| ----------- | ----------------------- |
| Node.js     | Runtime Environment     |
| Express.js  | Backend Framework       |
| Nodemailer  | Email Service           |
| dotenv      | Environment Variables   |
| body-parser | Form Data Parsing       |
| HTML5       | Structure               |
| CSS3        | Styling & Responsive UI |
| JavaScript  | Functionality           |

---

# 📂 Project Structure

```text
gmail-nodemailer/
├── public/
│   ├── mail.html
│   ├── mail.css
│   └── favv.png
│
├── app.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/gmail-nodemailer.git
cd gmail-nodemailer
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env` File

Create a `.env` file in the project root directory:

```env
PORT=5500

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

# 🔐 Gmail App Password Setup

To use Gmail SMTP securely:

1. Open Google Account Settings
2. Enable **2-Step Verification**
3. Navigate to **App Passwords**
4. Generate a new App Password
5. Copy the generated password
6. Use it as `EMAIL_PASS` in the `.env` file

⚠️ Important:
Do NOT use your normal Gmail password.

---

# 🚀 Start the Server

## Development Mode

```bash
node app.js
```

Server runs on:

```text
http://localhost:5500
```

Open the application in your browser:

```text
http://localhost:5500
```

---

# 📜 Package.json Scripts

```json
"scripts": {
  "start": "node app.js"
}
```

Run using:

```bash
npm start
```

---

# 📧 Email Workflow

The application workflow:

1. User enters name and email in the form
2. Frontend sends form data to Express backend
3. Nodemailer connects to Gmail SMTP
4. Confirmation email is sent
5. Backend returns success or failure response

---

# 🧠 Main Backend Configuration

## app.js

```javascript
require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require("path");
const nodemailer = require("nodemailer");

const port = 5500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'mail.html'));
});

app.post('/', function(req, res) {

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.emailid,
    subject: "Feedback form response",

    text:
      "Thank you " +
      req.body.name +
      " for subscribing.",
  };

  transporter.sendMail(mailOptions, (error, info) => {

    if (error) {
      console.error(error);
      return res.send("Email failed");
    }

    console.log("Email sent:", info.response);

    return res.send("Email sent successfully");

  });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

---

# 🌐 API Endpoint

## Send Email

```http
POST /
```

## Request Body

```json
{
  "name": "Alex",
  "emailid": "example@gmail.com"
}
```

## Success Response

```json
{
  "message": "Email sent successfully"
}
```

## Error Response

```json
{
  "message": "Email failed"
}
```

---

# 🎨 Frontend UI Features

## Contact Form Includes

* Full Name input field
* Email Address input field
* Subscribe button
* Responsive card container
* Modern dark glassmorphism UI
* Hover and focus interactions
* Accessibility improvements
* Responsive mobile layout

---

# 🖥️ UI Preview

## Before

* Basic layout
* Excessive black empty background
* Limited responsiveness
* Minimal button styling
* Poor visual hierarchy

## After

* Modern glassmorphism design
* Responsive centered layout
* Improved readability
* Better hover and focus effects
* Enhanced spacing and typography
* Improved accessibility
* Modern interactive styling

(Add screenshots here)

---

# 📦 Required Packages

Install required dependencies:

```bash
npm install express nodemailer dotenv body-parser
```

---

# ⚠️ Troubleshooting

## `npm start` not working

Ensure `package.json` contains:

```json
"scripts": {
  "start": "node app.js"
}
```

---

## `Cannot find module 'express'`

Run:

```bash
npm install
```

before starting the server.

---

## HTTP ERROR 405

### Cause

The frontend form was being submitted without the backend Express server handling the POST request.

### Fix

Ensure:

* Express server is running
* HTML page is opened through Express server
* Correct POST route exists
* `express.static()` is configured properly

---

## "Email failed" Error

### Possible Causes

* Invalid Gmail App Password
* Incorrect `.env` configuration
* Gmail 2FA not enabled
* Wrong SMTP credentials

### Fix

* Enable Gmail App Passwords
* Verify `.env` values
* Restart server after editing `.env`

---

# 🚀 Future Improvements

* HTML email templates
* Success/error toast notifications
* File attachment support
* Contact form validation
* OAuth2 authentication
* Rate limiting
* MongoDB integration
* Email logging system
* Docker deployment
* Admin dashboard integration

---

# 🌐 Deployment

You can deploy this backend using:

* Render
* Railway
* Vercel
* Cyclic

---

# 🤝 Contributing

Contributions are welcome.

## Contribution Steps

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# ⭐ Support

If you found this project useful:

* Star the repository
* Fork the project
* Contribute to improve the project

---

# 📄 License

This project is open-source and available under the MIT License.

