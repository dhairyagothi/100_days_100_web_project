# PeerRTC | Advanced WebRTC Video Chat

An advanced, fully functional Peer-to-Peer video conferencing web application built entirely using frontend technologies. It leverages the WebRTC protocol and PeerJS for signaling, allowing real-time video and audio communication directly between browsers without any custom backend server.

## 🚀 Features

- **Peer-to-Peer Connection:** Uses WebRTC for low-latency, secure browser-to-browser communication.
- **Real-Time Video/Audio:** Direct media streaming using the local device's camera and microphone.
- **Screen Sharing:** Allows users to share their screen seamlessly during a call using `getDisplayMedia`.
- **Media Controls:** Toggle mute (audio) and hide (video) states instantaneously.
- **Glassmorphism UI:** Premium, modern interface design featuring fluid gradients and glass-like components.

## 🛠️ Technologies Used

- **HTML5 & CSS3:** For structuring and styling the responsive glassmorphism UI.
- **Vanilla JavaScript (ES6+):** For application logic, state management, and DOM manipulation.
- **WebRTC API:** For handling the peer-to-peer connection and media streaming.
- **PeerJS:** A wrapper library for WebRTC that provides a free cloud signaling server, making connection establishment effortless.
- **FontAwesome:** For intuitive UI icons.

## 🧠 Why is this an Advanced/Critical project?

Implementing real-time video communication requires a deep understanding of several complex browser APIs:
1. **`navigator.mediaDevices`**: Handling asynchronous hardware requests (camera, microphone, display).
2. **WebRTC Protocol**: Managing SDP (Session Description Protocol) offers, answers, and ICE candidates (abstracted cleanly via PeerJS).
3. **MediaTrack Management**: Dynamically replacing tracks during an active call (e.g., switching from camera stream to screen share stream) without dropping the connection.
4. **State Management**: Keeping track of connection lifecycles, active calls, and hardware toggle states accurately.

## 🏃 How to Run

1. Open `index.html` in any modern web browser.
2. Grant camera and microphone permissions when prompted.
3. Your unique Peer ID will be generated automatically.
4. Open another tab (or share the ID with a friend on another device).
5. Paste the Peer ID into the "Connect to Peer" input and click **Connect**.
6. Enjoy real-time communication!
