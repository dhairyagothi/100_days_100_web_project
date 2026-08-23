# ⌨️ Air Typing Keyboard

<div align="center">

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FF6F00?style=for-the-badge&logo=google&logoColor=white)

### 🚀 Type in Mid-Air Using Hand Gestures

A futuristic web application that enables users to type without touching a physical keyboard by utilizing real-time hand tracking and gesture recognition powered by MediaPipe Hands.

</div>

---

## 📖 Overview

Air Typing Keyboard transforms hand movements into keyboard inputs using computer vision technology. Users can interact with a virtual keyboard through their webcam, making typing more immersive, touchless, and innovative.

The project demonstrates the integration of:

- Real-time Computer Vision
- Hand Gesture Recognition
- Human-Computer Interaction
- Interactive Frontend Development

---

## ✨ Features

### 🎯 Core Features

- Real-time hand tracking
- Virtual QWERTY keyboard
- Finger hover detection
- Pinch gesture key press
- Live text output area
- Space, Enter, and Backspace support
- Responsive design
- Smooth animations

### 🤖 Smart Features

- Predictive text suggestions
- Auto-correction support
- Typing analytics
- Gesture confidence tracking
- Performance monitoring

### 🎨 User Experience

- Modern Glassmorphism UI
- Dark & Light themes
- Real-time visual feedback
- Smooth hover animations
- Mobile-friendly interface

---

## 🖼️ Preview

### Main Interface

![alt text](<assets/screenshot.png>)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript | Application Logic |
| MediaPipe Hands | Hand Tracking |
| WebRTC | Webcam Access |
| Canvas API | Visual Rendering |

---

## 📂 Project Structure

```text
    Air-Typing-Keyboard/
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── animationEngine.js
    │   ├── app.js
    │   ├── gestureEngine.js
    │   ├── handTracker.js
    │   ├── keyboard.js
    │   └── predictionEngine.js
    └── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/100-Days-100-Web-Projects.git
```

### Navigate to Project

```bash
cd public/Air-Typing-Keyboard
```

### Run Locally

Using Python:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

or use VS Code Live Server.

---

## 🚀 How It Works

### Step 1

The application accesses the webcam using:

```javascript
navigator.mediaDevices.getUserMedia()
```

### Step 2

MediaPipe Hands detects:

- Hand landmarks
- Finger positions
- Hand orientation

### Step 3

The index fingertip position is mapped to a virtual keyboard.

### Step 4

A pinch gesture between the thumb and index finger triggers a key press.

### Step 5

The selected character is appended to the text editor.

---

## 🎮 Supported Gestures

| Gesture | Action |
|----------|---------|
| Hover | Highlight key |
| Pinch | Key Press |
| Swipe Left | Delete Character |
| Swipe Right | Insert Space |
| Double Pinch | Enter Key |
| Long Pinch | Caps Lock |

---

## 📊 Future Improvements

- Voice assistance
- Multi-language keyboard support
- AI-powered word prediction
- Gesture customization
- Air mouse mode
- Accessibility enhancements
- Offline support (PWA)

---

## 🔒 Security Considerations

- No sensitive data stored
- No hardcoded API keys
- Webcam data processed locally
- Secure browser APIs only
- User permission required for camera access

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 🐛 Known Limitations

- Requires a webcam
- Works best in good lighting conditions
- Gesture accuracy may vary based on camera quality
- Optimized for modern Chromium-based browsers

---

## 🌟 Learning Outcomes

This project helps developers understand:

- Computer Vision Fundamentals
- MediaPipe Integration
- Hand Tracking Systems
- Gesture Recognition
- Real-Time UI Updates
- Frontend Performance Optimization

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Made with ❤️ using HTML, CSS, JavaScript & MediaPipe

</div>