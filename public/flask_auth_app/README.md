# Flask Authentication App

This Flask application demonstrates user authentication using JWT tokens. Users can sign up, log in, view protected content, and log out.

## Features

- **Sign Up:** Register new users with a unique username and password.
- **Log In:** Authenticate users and generate a JWT token stored in a cookie.
- **Protected Page:** Access a protected page that displays a list of registered users.
- **Log Out:** Clear the JWT token from the cookie to log out.

## Libraries Used

- **Flask:** Web framework for Python.
- **Flask-SQLAlchemy:** Flask extension for SQLAlchemy, an SQL toolkit and ORM.
- **Werkzeug:** Library for password hashing and authentication utilities.
- **JWT (JSON Web Tokens):** For secure authentication token generation and verification.

## Tech Stack

- Python 3.x
- Flask
- Flask-SQLAlchemy
- Werkzeug
- JWT (JSON Web Tokens)
- SQLite

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dhairyagothi/50_days_50_web_project.git
   cd 50_days_50_web_project/public/flask_auth_app
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

## Configuration

1. Set up your Flask application:
   - Set `SECRET_KEY` in `app.py` for JWT token encryption.
   - Configure `SQLALCHEMY_DATABASE_URI` in `app.py` for your database.

## How to Run Locally

1. Initialize the database:

   ```bash
   python
   from app import db
   db.create_all()
   exit()
   ```

2. Run the Flask application:

   ```bash
   python app.py
   ```

3. Open your web browser and go to [http://localhost:5000](http://localhost:5000) to access the application.

## Usage

- **Sign Up:** Navigate to [http://localhost:5000/signup](http://localhost:5000/signup) to create a new user account.
- **Log In:** Navigate to [http://localhost:5000/login](http://localhost:5000/login) to log in with your credentials.
- **Protected Page:** After logging in, you can access [http://localhost:5000/protected](http://localhost:5000/protected) to view the list of users.
- **Log Out:** Click on the "Sign Out" button to log out from the application.
