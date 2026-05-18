# MERN Login System

## Description
A full-stack authentication system built using the MERN (MongoDB, Express, React - though here using EJS for views, Node.js) stack. This project demonstrates user registration, login, and secure routing using a database backend.

## Technologies Used
- Node.js
- Express.js
- MongoDB (via Mongoose)
- EJS (Embedded JavaScript templates)

## Features
- **User Registration**: Create new accounts with secure, hashed passwords utilizing `bcrypt`.
- **Password Validation**: Validates password strength via the `validator` library.
- **Authentication**: Authenticate users against stored credentials in a MongoDB database.
- **Dynamic Templates**: Uses EJS templates for simple Login and Sign Up views.

## Setup Instructions
1. Navigate to the project folder: `public/loginusingmern/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure you have MongoDB running locally or update the connection string in `mongo.js`.
4. Start the server:
   ```bash
   node index.js
   ```
5. Open `http://localhost:3000` (or specified port) in your browser.

## Folder Structure
```text
loginusingmern/
 ├── views/           # EJS templates for login, signup, and home
 ├── public/          # Static assets (CSS/JS)
 ├── index.js         # Main server and routes
 ├── mongo.js         # MongoDB connection schema
 └── package.json     # Project dependencies
```

## Author
[Mithil](https://github.com/mithilP007)
