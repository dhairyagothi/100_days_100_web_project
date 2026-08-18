# 🖐️ Hand Gesture Controller

A browser-based hand gesture controller that uses webcam input and MediaPipe Hands to detect hand landmarks and map supported gestures to synthetic keyboard events.

The project demonstrates how computer-vision-based hand tracking can be connected to browser keyboard event handling to create an interactive hands-free control interface.

---

## ✨ Features

- Real-time webcam-based hand tracking
- Hand landmark detection using MediaPipe Hands
- Gesture recognition using landmark coordinates
- Supported directional gestures
- Synthetic `keydown` and `keyup` event generation
- Gesture-state tracking to reduce repeated events
- Event throttling to prevent excessive keyboard events
- Real-time gesture status display
- Virtual keystroke execution log
- Visual hand-landmark debugging overlay

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- MediaPipe Hands
- MediaPipe Camera Utilities
- Web APIs
  - `getUserMedia` through the camera utility
  - `KeyboardEvent`
  - `requestAnimationFrame`
  - Canvas API

---

## 📂 Project Structure

```text
handle-gesture-controller/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

> The exact project structure may vary depending on the files included in the repository.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Navigate to the Project

```bash
cd handle-gesture-controller
```

### 3. Run the Project

Open the project using a local development server.

For example, with VS Code Live Server:

```text
Right Click → Open with Live Server
```

A local server is recommended because the project requires webcam access.

---

## 📷 Camera Requirements

The application requires access to a webcam for hand tracking.

When prompted by the browser:

1. Allow camera access.
2. Keep your hand visible within the camera frame.
3. Make the supported gestures in front of the webcam.

---

## 🎮 Gesture Controls

The controller currently evaluates hand landmarks to detect directional gestures.

| Gesture | Generated Key |
|---|---|
| Index finger raised while middle finger remains lowered | `ArrowUp` |
| Index and middle fingers raised | `ArrowDown` |
| Horizontal thumb movement with the required hand position | `ArrowLeft` |

The detected gesture is displayed in the interface and the generated virtual key is added to the event log.

---

## ⚙️ How It Works

The controller follows a simple processing pipeline:

```text
Webcam
   ↓
MediaPipe Hands
   ↓
Hand Landmark Detection
   ↓
Gesture Evaluation
   ↓
Gesture State Validation
   ↓
Synthetic Keyboard Event
   ↓
Target Application
```

### 1. Webcam Input

The camera utility continuously captures frames from the user's webcam.

### 2. Hand Landmark Detection

MediaPipe Hands processes each frame and provides hand landmark coordinates.

### 3. Gesture Evaluation

The application checks specific landmark positions such as:

- Index fingertip
- Index knuckle
- Middle fingertip
- Middle knuckle
- Thumb
- Thumb base

These coordinates are used to determine the current gesture.

### 4. Gesture State Management

The controller tracks the previous gesture and requires the hand to return to a neutral state before triggering the same gesture again.

This helps prevent a single sustained gesture from generating an uncontrolled stream of keyboard events.

### 5. Synthetic Keyboard Events

Detected gestures are mapped to keyboard event values such as:

```text
ArrowUp
ArrowDown
ArrowLeft
```

The application generates corresponding `keydown` and `keyup` events for compatible DOM event listeners.

---

## ⏱️ Event Throttling

A short throttle interval is used between generated keyboard events.

This helps prevent excessive event generation when hand tracking produces repeated detections across consecutive frames.

---

## 🖥️ Visual Debugging

The application draws detected hand landmarks on a canvas overlay.

This provides visual feedback that helps users understand which hand landmarks are being detected by the tracking system.

---

## 📝 Event Log

Every generated virtual keyboard event is recorded in the event log with a timestamp.

Example:

```text
[12:30:15] 🚀 Dispatched Virtual Key: ArrowUp
```

This makes it easier to verify whether gestures are being converted into keyboard events.

---

## ⚠️ Browser Considerations

Synthetic keyboard events generated with JavaScript are not identical to physical keyboard input.

In particular, browser-generated synthetic events are not trusted hardware events and may not work with applications that specifically require real user input.

The controller is intended for applications that explicitly handle DOM keyboard events.

---

## 🔧 Troubleshooting

### Camera is not working

- Check that the browser has camera permission.
- Make sure another application is not exclusively using the webcam.
- Run the project through a local development server.

### Gestures are not detected

- Make sure your hand is clearly visible.
- Improve lighting conditions.
- Keep your hand within the camera frame.
- Try performing the gesture more clearly.

### Keyboard events are not affecting another application

Make sure the target application listens for DOM `keydown` and `keyup` events and supports synthetic keyboard events.

---

## 🔮 Future Improvements

Possible improvements include:

- Additional gesture mappings
- Custom gesture configuration
- Adjustable detection sensitivity
- More robust gesture classification
- Support for multiple hands
- Additional keyboard shortcuts
- Gesture calibration
- Improved mobile/device compatibility
- Better accessibility controls

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature or bug-fix branch.
3. Make your changes.
4. Test the project locally.
5. Commit your changes.
6. Push the branch.
7. Open a Pull Request.

---

## 📄 License

Refer to the repository's license file for the applicable licensing terms.