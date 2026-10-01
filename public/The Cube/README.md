# 🎲 The Cube – Interactive 3D Rubik's Cube Simulator

An interactive 3D Rubik's Cube simulator built with **Three.js**, **HTML**, **CSS**, and **JavaScript**. The application provides a realistic cube-solving experience directly in the browser with smooth animations, touch controls, scramble generation, timing features, and customizable themes.

## 🚀 Features

- Interactive 3D Rubik's Cube rendering using Three.js
- Multiple cube sizes:
  - 2×2×2
  - 3×3×3
  - 4×4×4
  - 5×5×5
- Mouse and touch gesture support
- Random scramble generation
- Solve timer with performance tracking
- Best time and statistics tracking
- Multiple color themes
- Adjustable camera angle and cube settings
- Smooth cube rotation animations
- Responsive design for desktop and mobile devices
- Local storage support for saving preferences and scores

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Three.js
- WebGL
- Local Storage API

## 📱 Controls

### Desktop
- Click and drag cube faces to rotate layers
- Drag outside cube faces to rotate the entire cube
- Use settings to customize cube size and appearance

### Mobile
- Swipe on cube faces to rotate layers
- Drag to rotate the entire cube
- Double tap to start a new solve

## ⚙️ Installation

### Clone the Repository




### Run Locally

Open `index.html` in your browser or start a local server:


## 📂 Project Structure

```text
rubiks_cube/
│
├── index.html
├── style.css
├── main.js
└── README.md
```

## 🎯 How It Works

The project uses **Three.js** to render a fully interactive Rubik's Cube in a WebGL scene.

Key systems include:

- Cube geometry generation
- Layer rotation mechanics
- Mouse and touch interaction controls
- Random scramble generation
- Solve timer
- Statistics tracking
- Theme customization
- Smooth animation engine

## 📊 Statistics Tracking

The simulator tracks:

- Total solves
- Best solve time
- Worst solve time
- Average of 5 solves
- Average of 12 solves
- Average of 25 solves

All statistics are stored locally using the browser's Local Storage.

## 🔮 Future Improvements

- Cube solving algorithms
- Move history and undo support
- Online leaderboards
- Multiplayer challenges
- Custom scramble input
- Tutorial mode
- Export and import statistics

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

## 📄 License

This project is intended for educational and personal use. Please review third-party licenses before commercial use.

## 🙏 Acknowledgements

- Three.js
- WebGL Community
- Rubik's Cube Community

---

Made with ❤️ using Three.js and JavaScript.