# Flask Authentication App

A full-stack authentication web app built with Flask, SQLite, and JWT cookies.

---

## 🚀 Why This Needs a Local Server

This is a **backend project**. It cannot run by simply opening a file in the browser. It requires a Flask server running locally because:

- The browser alone cannot hash passwords
- Sessions are stored in cookies by the server
- User data is stored in a SQLite database
- Routes like `/signup`, `/login`, and `/protected` are handled by Python

---

## ✅ Prerequisites

Before running this project, make sure you have:

- Python 3.x installed → [Download here](https://www.python.org/downloads/)
- `pip` available (comes with Python)
- Git installed → [Download here](https://git-scm.com/)

Verify your installation:

```bash
python --version
pip --version
```

---

## 📦 Local Setup Guide

### Step 1 — Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
cd 100_days_100_web_project/public/flask_auth_app
```

### Step 2 — Create a Virtual Environment

```bash
python -m venv venv
```

Activate it:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal — that means it's active ✅

### Step 3 — Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4 — Set Up Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Open `.env` and set a secret key:
SECRET_KEY=your_secret_key_here

### Step 5 — Run the App

```bash
python app.py
```

### Step 6 — Open in Browser

Go to:
http://127.0.0.1:5000

You should see the login/signup page ✅

---

## 📁 Project Structure
flask_auth_app/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
├── static/             # CSS, JS, images
└── templates/          # HTML templates
├── login.html
├── signup.html
└── protected.html

---

## 🛠️ Features

- User Signup and Login
- Password hashing with bcrypt
- JWT-based session cookies
- Protected routes
- SQLite database

---

## 🧰 Technologies Used

- Python 3
- Flask
- SQLite
- JWT (JSON Web Tokens)
- HTML and CSS

---

## 🤝 Contributing

Feel free to open issues or submit pull requests.
Follow the main [CONTRIBUTING.md](../../CONTRIBUTING.md) guide.

---

## 👤 Author

[Dhairya Gothi](https://github.com/dhairyagothi)