# 🪐 Saturn Particle Gesture

An interactive, browser-based space visualization that renders a Saturn-like planet formed by dynamic particle systems, fully controlled in real-time via hand gesture recognition using your webcam and **MediaPipe Hands**.

---

## ✨ Features

- **Dynamic Particle Physics:** Renders a 3000+ interactive particle system forming the planetary core and Saturn's rings with high-performance canvas loops.
- **Starfield Background:** Deep space starfield rendering featuring smooth parallax scrolling.
- **Real-Time Gesture Tracking:** Smooth camera-based tracking leveraging Google's MediaPipe Hands API.
- **Atmospheric Glow:** Custom multi-layer glow effects and radial shading to simulate atmospheric depth.
- **Snappy Mirrored Webcam Overlay:** A minimal, non-intrusive preview showing webcam feed and hand tracking status.
- **Cross-Platform:** Responsive layouts optimized for modern web browsers.

---

## 🛠️ Tech Stack

- **Core Engine:** HTML5 Canvas, Vanilla JavaScript (ES6+ Modules)
- **Styling:** Vanilla CSS3 (Custom Typography & Dark Theme Layout)
- **AI Models:** MediaPipe Hands, MediaPipe Camera Utilities (CDN-loaded)

---

## 🎮 How to Play & Controls

### 🖐️ Hand Gestures

| Gesture | Action | Description |
| :--- | :--- | :--- |
| 🖐️ **Open Hand** | **Idle Scatter** | Particles drift apart into a loose starfield cloud. |
| ✊ **Fist** | **Saturn Formation** | Particles compress and orbit to form Saturn's core and rings. |
| ↔️ **Move Fist L/R** | **Rotate Planet** | Rotates the entire planet along the Y-axis. |
| ↕️ **Closer / Farther** | **Zoom In / Out** | Scales the camera viewport size based on hand distance from webcam. |
| 👍 **Thumbs Up** | **Supernova Charge** | Accelerates particles to high velocities for a cosmic shockwave. |

### ⌨️ Keyboard Shortcuts

- `T` — Toggle Hand Tracking (Enable/Disable Webcam feed)
- `I` — Toggle Instructions Overlay

---

## 🚀 Installation & Local Setup

To protect your privacy, web browsers restrict webcam access to secure contexts (`https://` or `localhost`). You must run this project through a local web server:

### Option 1: Python HTTP Server (Easiest)
If you have Python installed, run this command in your project folder:
```bash
python -m http.server 8080
```
Then open your browser and navigate to: [http://localhost:8080](http://localhost:8080)

### Option 2: Node.js (Static Server)
If you prefer Node.js, you can install and use `serve`:
```bash
npx serve .
```
Then open your browser to the URL printed in the terminal (usually `http://localhost:3000`).

---

## 🔧 Troubleshooting

* **Camera Permission Denied:** Ensure you grant camera permission in your browser settings. The tracking status indicator will display "Camera Off" if permission is missing.
* **Model Failed to Load:** Since MediaPipe model files are loaded via CDN, ensure you have an active internet connection.
* **Performance Lag:** If the frame rate drops, close other browser tabs or background applications. Mobile devices may automatically scale down particle counts for smoother performance.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE). Feel free to adapt and build upon it!

---

## 👥 Author

Created by **Sparsh Bansal** ([itzzSPcoder](https://github.com/itzzSPcoder)). Feel free to connect, star, or fork!
