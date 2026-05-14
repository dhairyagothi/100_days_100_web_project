# MERN Login System

## Description
A full-stack authentication system built using the MERN (MongoDB, Express, React - though here using EJS for views, Node.js) stack. This project demonstrates user registration, login, and secure routing using a database backend.

## Technologies Used
- Node.js
- Express.js
- MongoDB (via Mongoose)
- EJS (Embedded JavaScript templates)

## Features
- **User Registration**: Create new accounts with encrypted passwords (if implemented).
- **Secure Login**: Authenticate users against stored credentials.
- **Session Management**: Maintain user state across requests.
- **Dynamic Views**: Uses EJS to render personalized content based on authentication status.

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
