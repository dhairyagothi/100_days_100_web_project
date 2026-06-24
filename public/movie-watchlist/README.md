# 🎬 Movie Watchlist App

## 🚀 Overview

The **Movie Watchlist App** is a modern, interactive web application that allows users to search for movies, view details, and build a personal watchlist.

It uses the **OMDb API** to fetch real-time movie data and stores user selections locally using **browser Local Storage**, making it fully frontend-based and persistent.

---

# ✨ Features

## 🔍 Movie Search

* Search movies by title using OMDb API
* Real-time movie data fetching
* Displays:

  * Title
  * Year
  * Genre
  * Runtime
  * IMDb Rating
  * Poster image

---

## 📋 Watchlist Management

* Add movies to personal watchlist
* Prevent duplicate entries
* Mark movies as:

  * 🎬 To Watch
  * ✅ Watched
* Remove movies from list with smooth animation

---

## 📊 Statistics Dashboard

* Total movies in watchlist
* Number of watched movies
* Average IMDb rating of saved movies

---

## 🎛️ Smart Filtering

Filter your watchlist by:

* All movies
* 🎬 To Watch
* ✅ Watched

---

## 💾 Data Persistence

* Uses **Local Storage (`movies_list`)**
* Data remains saved even after page reload
* No login required

---

## 🔔 User Feedback System

* Toast notifications for actions:

  * Added to watchlist
  * Removed movie
  * Marked watched/unwatched
  * Duplicate warning

---

# 🛠️ Tech Stack

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| HTML5            | Structure               |
| CSS3             | Styling and UI          |
| JavaScript (ES6) | Logic and functionality |
| OMDb API         | Movie data source       |
| Local Storage    | Data persistence        |

---

# 📂 Project Structure

```text id="movie_structure"
movie-watchlist/
│
├── index.html      # Main UI layout
├── style.css       # Styling and responsive design
├── script.js       # Application logic + API integration
├── image.png       # Favicon
└── README.md
```

---
## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/100_days_100_project.git
```

2. Navigate to the project folder:

```bash
cd movie-watchlist
```

3. Open `index.html` in your browser or run using Live Server.

---

# ⚙️ How It Works

## 1️⃣ Search Movie

* User enters movie title
* App fetches data from OMDb API
* Displays movie card preview

## 2️⃣ Add to Watchlist

* Movie is stored in local storage
* Prevents duplicates automatically

## 3️⃣ Manage Watchlist

* Mark as watched/unwatched
* Remove movies
* Filter by category

## 4️⃣ Stats Update

* Dashboard updates in real time based on watchlist data

---

# 🧠 Key Features Explained

### 🎯 API Integration

Uses:

```
https://www.omdbapi.com/?t=movie_name&apikey=YOUR_KEY
```

### 💾 Local Storage

Stores data under:

```
movies_list
```

### ⚡ Dynamic UI

* DOM updates without page reload
* Smooth animations for add/remove actions

---

# 📱 Responsive Design

Works seamlessly on:

* 💻 Desktop
* 🖥️ Laptop
* 📱 Mobile
* 📲 Tablets

---

# 🎯 Learning Outcomes

This project demonstrates:

* API integration in JavaScript
* Asynchronous programming (fetch/async-await)
* DOM manipulation
* State management using arrays/objects
* Local Storage handling
* UI filtering systems
* Event-driven architecture

---

# 🔮 Future Improvements

* 🔐 User authentication system
* ☁️ Cloud sync watchlist
* 🎞️ Movie recommendations engine
* ⭐ Rating & review system
* 🎨 Dark mode UI
* 📊 Advanced analytics dashboard
* 📺 Trailer preview integration

---

# 📄 License

This project is created for **learning and educational purposes**.

Feel free to use, modify, and enhance it for personal or portfolio development.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

Happy Watching! 🎬🍿
