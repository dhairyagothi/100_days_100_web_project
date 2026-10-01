# 😊 Mood Tracker Dashboard

A beautiful and interactive **Mood Tracker Dashboard** that allows users to record their daily emotions, visualize mood trends, and generate a monthly mood report. The project features a modern glassmorphism design, animated mood jar, local storage support, and real-time mood statistics.

---

## 🚀 Features

### 🎭 Mood Logging

Track your emotions by selecting one of four mood categories:

* 😊 Great
* 😄 Good
* 😐 Neutral
* 😢 Bad

Each mood entry is instantly added to the dashboard.

---

### 🫙 Interactive Mood Jar

* Every recorded mood creates a floating animated emoji ball inside the jar.
* Different moods use different colors.
* Smooth entry animations enhance the user experience.

---

### 📊 Monthly Mood Report

The dashboard automatically:

* Counts total mood entries
* Calculates the dominant mood
* Displays a monthly summary
* Updates statistics in real time

Example:

> The mood this month is mainly Great 😊

---

### 📈 Mood Fluctuation Chart

A visual timeline of recorded moods using emoji indicators.

This helps users quickly identify emotional patterns throughout the month.

---

### 💾 Local Storage Support

Mood data is automatically saved in the browser using Local Storage.

Stored data includes:

* Great mood count
* Good mood count
* Neutral mood count
* Bad mood count
* Mood chart history
* Mood jar contents

Data remains available even after refreshing or reopening the browser.

---

### ✨ Modern UI Design

* Glassmorphism cards
* Soft gradient background
* Floating blur effects
* Smooth animations
* Fully responsive layout
* Mobile-friendly design

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Local Storage API

---

## 📂 Project Structure

```text
Mood-Tracker-Dashboard/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
```

---

## ⚙️ How It Works

### 1. Add a Mood

Click any mood button:

```javascript
addMood("great");
addMood("good");
addMood("neutral");
addMood("bad");
```

---

### 2. Update Dashboard

The application automatically:

* Updates mood counts
* Calculates dominant mood
* Refreshes the monthly report

```javascript
updateUI();
```

---

### 3. Save Data

Mood data is stored in browser local storage.

```javascript
localStorage.setItem(
  "moodTrackerData",
  JSON.stringify(data)
);
```

---

### 4. Load Previous Data

When the page loads:

```javascript
loadData();
```

All saved moods are restored automatically.

---

## 📱 Responsive Design

The dashboard adapts seamlessly to:

* Desktop
* Tablet
* Mobile Devices

Media queries ensure an optimized layout for smaller screens.

---

## 🎨 UI Highlights

### Background Effects

* Animated blurred circles
* Soft pastel color palette
* Floating visual elements

### Glassmorphism Components

* Transparent cards
* Backdrop blur effects
* Soft shadows

### Smooth Animations

* Floating mood balls
* Fade-in effects
* Hover interactions
* Entry animations

---

## 🌟 Future Improvements

Potential enhancements:

* Weekly analytics
* Calendar mood view
* Mood streak tracking
* Dark mode
* Export mood reports
* Charts using Chart.js
* User authentication
* Mood notes/journaling

---

## 🧠 Learning Concepts

This project demonstrates:

* DOM Manipulation
* Event Handling
* CSS Animations
* Responsive Web Design
* Local Storage
* JavaScript Objects
* Dynamic UI Updates

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💖 Acknowledgements

Built with HTML, CSS, and JavaScript to promote emotional awareness and help users visualize their mood journey in a fun and interactive way.

### If you like this project, give it a ⭐ on GitHub!
