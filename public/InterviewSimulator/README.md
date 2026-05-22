# 🎙️ Interview Simulator

A modern, interactive Interview Simulator web application designed to help you practice and improve your interview skills. Experience realistic pressure with a 60-second countdown timer, dynamic stress tracking, and real-time voice interaction using the Web Speech API.

## ✨ Features

- **Voice Interaction**: Speak your answers naturally! The app uses the Web Speech API to transcribe your speech into text in real-time.
- **Dynamic Stress Tracker**: The app monitors your answer length and response time, increasing the "Stress Level" and changing the background environment to simulate real pressure if you don't answer adequately or run low on time.
- **Ultra-Premium Glassmorphism UI**: A compact, sleek, no-scroll interface designed with realistic glass textures, floating blobs, advanced inner-shadows, and satisfying hover physics.
- **Progress Tracking**: Visual indicators track your current question progress, remaining time (updated to 60 seconds), and stress level.
- **Fully Responsive**: Works seamlessly on both desktop and mobile devices.

## 🚀 Setup Instructions

Since this project utilizes the **Web Speech API**, it requires a **secure context** (HTTPS or `localhost`) to function properly. You cannot just double-click the `index.html` file or access it over a local IP address (like `192.168.x.x`) without a secure connection.

### Prerequisites
- Node.js installed on your machine (for serving the app).
- A modern browser like **Google Chrome** or **Microsoft Edge** (Recommended for the best Speech Recognition support).

### Steps to Run Locally

1. **Navigate to the Directory**
   Open your terminal and navigate to the project folder:
   ```bash
   cd InterviewSimulator
   ```

2. **Serve the Project via Localhost**
   You need a local server to run this securely. You can use `npx serve`:
   ```bash
   npx serve .
   ```
   *Alternatively, if you use VS Code, you can use the **Live Server** extension.*

3. **Open the App**
   Open your browser and navigate strictly to:
   ```text
   http://localhost:3000
   ```
   *(Note: Do not use your network IP address like `192.168.x.x` as browsers will block the microphone).*

4. **Start Practicing!**
   Click the microphone button, grant the necessary permissions, and start speaking your answers.

## 🛠️ Technologies Used
- **HTML5**: Semantic structure.
- **CSS3**: Modern styling, Flexbox, Animations, and Glassmorphism effects.
- **JavaScript (ES6+)**: Core logic, Timer Management, and Web Speech API integration.
- **FontAwesome**: Scalable vector icons.
- **Google Fonts**: Custom typography (`Outfit` and `Inter`).
