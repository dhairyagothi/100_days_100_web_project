# 🍽️ Zomato Clone (Full Stack Project)

## 📌 Overview

This is a Zomato Clone project built with a focus on modern web development practices. The project includes a responsive frontend UI and a backend setup using Node.js, Express, and MongoDB for handling CRUD operations.

---

## 🚀 Features

* Responsive Zomato-like UI
* Navbar with logo and authentication buttons
* Login & Signup pages
* Dark mode support 🌙
* Backend setup with Express & MongoDB
* CRUD operations for Food items

---

## 📁 Project Structure

```
zomato-clone/
│
├── public/                # Frontend
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── css/
│   │   └── home.css
│   ├── js/
│   ├── images/
│   └── assets/
│
├── server/                # Backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express.js
* Database: MongoDB
* Tools: Git, GitHub

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone <your-repo-link>
cd zomato-clone
```

### 2️⃣ Install dependencies

```
npm install express-rate-limit
npm install
npm install mongoose
npm install express
npm install cors
npm install dotenv
```

### 3️⃣ Run the server

```
node server/server.js
```

### 4️⃣ Open in browser

```
http://localhost:3000
```

---

## 🔥 API Endpoints (Food CRUD)

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| POST   | /api/food     | Create food item |
| GET    | /api/food     | Get all foods    |
| PUT    | /api/food/:id | Update food      |
| DELETE | /api/food/:id | Delete food      |

---

## 📌 Notes

* All frontend files are served from the `public` folder
* Backend is structured using MVC pattern (Model-View-Controller)
* Project is under active development 🚧

---

## 🤝 Contribution

Feel free to fork this repository and contribute by creating pull requests.

---

## ⭐ Acknowledgement

Inspired by the Zomato UI design.
see in local 
mongosh
show dbs
use zomato
show collections


## 🚀 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
cd 100_days_100_web_project

2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
PORT=3000
4. Start the Server
node server/server.js

The application will run on:

http://localhost:3000

---

## MongoDB Database Setup

```md
## 🗄️ Database Setup

The project uses MongoDB for storing restaurant and food-related data.

### Option 1: Local MongoDB

Install MongoDB locally and use:

```env
MONGO_URI=mongodb://127.0.0.1:27017/zomato

Start MongoDB:

mongod
Option 2: MongoDB Atlas
Create a MongoDB Atlas cluster.
Create a database user.
Whitelist your IP address.
Copy the connection string.
Paste it into your .env file:
MONGO_URI=your_mongodb_atlas_connection_string

---

## Environment Configuration

```md
## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
Variable	Description
MONGO_URI	MongoDB connection string
PORT	Server port number

---

## Data Structure Information

```md
## 📊 Data Structure

Restaurant documents contain the following fields:

| Field | Description |
|---------|------------|
| name | Restaurant name |
| cuisines | List of cuisines offered |
| rating | Restaurant rating |
| location | Restaurant address/location |
| images | Restaurant image URLs |

### Example Document

```json
{
  "name": "Pizza Hub",
  "cuisines": ["Italian", "Fast Food"],
  "rating": 4.5,
  "location": "Mumbai",
  "images": [
    "image1.jpg",
    "image2.jpg"
  ]
}

---

## Additional Section (Recommended)

```md
## 📂 Project Structure

```text
├── public/
├── server/
│   └── server.js
├── models/
├── routes/
├── .env
├── package.json
└── README.md

