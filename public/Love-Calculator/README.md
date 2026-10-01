# ❤️ Love Calculator

A fun and interactive Love Calculator built using **HTML, CSS, and JavaScript**. Enter your name and your crush's name to discover your compatibility percentage with beautiful animations, glassmorphism UI, floating hearts, and dynamic love messages.

## ✨ Features

* 💖 Modern Glassmorphism UI Design
* 🌈 Animated Gradient Background
* ❤️ Floating Hearts Animation
* 🎭 Dynamic Love Compatibility Calculation
* 🎯 Randomized Romantic Messages
* ⌨️ Enter Key Support
* 🔄 Loading Animation Effect
* 📱 Fully Responsive Design
* 🌙 Theme Preference Storage Support
* ✅ Input Validation

---

## 🚀 Live Demo

Open the project in your browser and start calculating love compatibility instantly.

---

## 📂 Project Structure

```text
LoveCalculator/
│
├── index.html
├── style.css
├── script.js
├── pink-realistic-heart-isolate-on-transparente-background-symbol-love-3d-heart-icon-png.webp
├── favv.png
└── README.md
```

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Font Awesome Icons
* Google Fonts

---

## 📸 UI Highlights

### Glassmorphism Card

A modern transparent card with blur effects and smooth shadows.

### Animated Background

Beautiful pink gradient background with continuous animation.

### Floating Hearts

Romantic floating heart particles for an engaging experience.

### Dynamic Results

Different compatibility messages and icons based on the generated score.

---

## 🎮 How It Works

1. Enter **Your Name**.
2. Enter **Crush Name**.
3. Click the **Calculate** button or press **Enter**.
4. Wait for the loading animation.
5. View your compatibility percentage and romantic message.

---

## 🧠 Love Score Algorithm

The calculator combines both names and:

* Counts character frequencies.
* Gives higher weight to repeated letters.
* Adds a name-length factor.
* Generates a compatibility percentage between **0% and 100%**.

```javascript
weightedScore += count * count;
weightedScore += combined.length * 3;
const loveIndex = weightedScore % 101;
```

---

## 💌 Compatibility Categories

| Score Range | Result                  |
| ----------- | ----------------------- |
| 0 - 30      | 💔 Better as friends    |
| 31 - 60     | 💛 Potential Match      |
| 61 - 90     | 💕 Strong Compatibility |
| 91 - 100    | ❤️‍🔥 Soulmates         |

---

## 📱 Responsive Design

The application is optimized for:

* Desktop
* Tablet
* Mobile Devices

---

## 🔧 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/love-calculator.git
```

Navigate to the project folder:

```bash
cd love-calculator
```

Open:

```bash
index.html
```

in your browser.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Add new feature"
```

4. Push to GitHub.

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## ⭐ Future Enhancements

* Share Results on Social Media
* Dark Mode Toggle
* Sound Effects
* Couple Avatar Generator
* Love History Storage
* Advanced Compatibility Algorithm

---

## 📜 License

This project is open source and available under the MIT License.

---

### ❤️ Made with Love using HTML, CSS & JavaScript
