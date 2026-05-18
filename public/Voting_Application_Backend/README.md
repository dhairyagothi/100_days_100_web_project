# Voting Application Backend

## Description
A secure Node.js & Express.js backend API server for a Voting Application, featuring JWT authentication and MongoDB integration via Mongoose.

## Technologies Used
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)

## Features
- **Secure Authentication**: User registration and login utilizing JWT token authentication.
- **Database Schema**: Structured schemas for users and candidates with MongoDB and Mongoose.
- **Modular Architecture**: Clean, separate routing and controller logic for easy maintenance.

## Setup Instructions
1. Clone the repository.
2. Navigate to the server folder: `cd public/Voting_Application_Backend/server`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure database environment variables (e.g. `PG_USER`, `PG_HOST` etc. or MongoDB URI/JWT secrets as applicable).
5. Start the backend server:
   ```bash
   npm start
   ```

## Folder Structure
```text
Voting_Application_Backend/
 ├── server/          # Node.js/Express.js backend application
 └── package-lock.json
```

## Author
[Mithil](https://github.com/mithilP007)
