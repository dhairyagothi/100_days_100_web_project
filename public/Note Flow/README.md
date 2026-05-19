# Note Flow

A modern full-stack Notes Application built with React, Node.js, Express, MongoDB, and TipTap Editor.  
The application provides a clean writing experience with rich-text editing, real-time note switching, dark mode support, and an intuitive UI inspired by modern productivity tools.

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>


# Features

### 1. Rich Text Editor
Built using TipTap editor with support for:
- Bold
- Italic
- Headings
- Bullet Lists


### 2. Dark Mode
Smooth light/dark theme switching for better user experience and accessibility.



### 3. Search Notes
Instantly search and filter notes from the sidebar.



### 4. Real-Time Note Switching
Seamlessly switch between notes without refreshing the page.



### 5. Delete Notes
Delete notes instantly with responsive UI updates.



### 6. Responsive Layout
Clean and minimal UI designed for modern note-taking workflows.



### 7. Modern UI/UX

- Interactive toolbar
- Hidden smooth scrollbars
- Hover effects
- Active note states
- Structured editor layout

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# Tech Stack

##   Frontend
- React
- Vite
- TipTap Editor
- React Icons
- CSS3



## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# Project Structure

## Frontend

```bash
client/
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Editor.jsx
│   │   ├── NoteCard.jsx
│   │   ├── NotesList.jsx
│   │   ├── RichEditor.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── services/
│   │   └── notesApi.js
│   │
│   ├── styles/
│   │   └── App.css
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

## Backend

```bash
server/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── notesController.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   └── Notes.js
│   │
│   ├── routes/
│   │   └── notesRoutes.js
│   │
│   └── app.js
│
├── .env
├── server.js
└── package.json
```

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# Installation

## 1️. Clone the Repository

```bash
git clone https://github.com/Anurag-3112/Note-Flow.git
```

<p align="center">
  <img 
    width="80%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=1&section=header"
  />
</p>

## 2️. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

<p align="center">
  <img 
    width="80%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=1&section=header"
  />
</p>

## 3️. Backend Setup

```bash
cd server
npm install
node server.js
```

Backend runs on:

```bash
http://localhost:5000
```

<p align="center">
  <img 
    width="80%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=1&section=header"
  />
</p>

# Environment Variables

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string OR mongodb://127.0.0.1:27017/notesDB
```

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>


# API Endpoints

## Get All Notes

```http
GET /api/notes
```

### Response

```json
[
  {
    "_id": "665a1f3d2c91b0a123456789",
    "title": "Meeting Notes",
    "content": "<p>Project discussion</p>",
    "createdAt": "2026-05-12T10:00:00.000Z",
    "updatedAt": "2026-05-12T10:30:00.000Z"
  }
]
```

<p align="center">
  <img 
    width="80%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=1&section=header"
  />
</p>

## Create Note

```http
POST /api/notes
```

### Request Body

```json
{
  "title": "My Note",
  "content": "<p>Hello World</p>"
}
```

<p align="center">
  <img 
    width="80%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=1&section=header"
  />
</p>

## Update Note

```http
PUT /api/notes/:id
```

### Response

```json
{
  "_id": "665a1f3d2c91b0a123456789",
  "title": "Updated Title",
  "content": "<h1>Updated Content</h1>",
  "updatedAt": "2026-05-12T11:00:00.000Z"
}
```

<p align="center">
  <img 
    width="80%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=1&section=header"
  />
</p>

## Delete Note

```http
DELETE /api/notes/:id
```

### Response

```json
{
  "message": "Note deleted successfully"
}
```


<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# Key Learnings

- Managing rich-text editor state using TipTap
- React state synchronization
- Full-stack CRUD operations
- MongoDB schema design
- REST API architecture
- Component-based UI design
- Dark mode implementation

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# Screenshots

<p align="center">
  <img src="./assets/image1.png" width="80%" />
  &nbsp;
  <img src="./assets/image2.png" width="80%" />
</p>


<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# Future Improvements

- Authentication & Authorization
- Tags & Categories
- Markdown Export
- Drag & Drop Notes
- Pinned Notes
- Collaborative Editing

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# Author

## Anurag Kumar

- GitHub: https://github.com/Anurag-3112/
- LinkedIn: https://linkedin.com/in/anurag-kumar-work/

<p align="center">
  <img 
    width="100%" 
    src="https://capsule-render.vercel.app/api?type=rect&color=0:9ca3af,100:9ca3af&height=3&section=header"
  />
</p>

# ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!

<p align="center">
  <img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:2563eb,100:9333ea&height=120&section=footer"/>
</p>
