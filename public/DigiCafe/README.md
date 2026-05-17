# 🎥 DigiCafe - WebRTC Video Conference & File Sharing

DigiCafe is a real-time, multi-user WebRTC application that allows users to instantly create and join rooms for group video calls, real-time messaging, and high-speed peer-to-peer file sharing—all without uploading files to a centralized server.

## ✨ Features

- **🎬 Multi-Peer Video Conferencing**: Join rooms with up to 6 participants for seamless HD video calls
- **💬 Real-Time Group Chat**: Instant messaging with native emoji picker support and WhatsApp-style large emojis
- **📁 P2P File Sharing**: Drag-and-drop file sharing directly between peers without server uploads
- **🚀 Instant Rooms**: Generate shareable room codes and links for quick access
- **🎨 Modern Premium UI**: Dark mode, custom gradients, fully responsive design, and smooth animations
- **🔐 Peer-to-Peer Security**: Direct connections between users with no data stored on servers

## 🛠️ Technologies Used

| Category | Technology |
|----------|-----------|
| **Frontend** | React.js, Vite, Vanilla CSS, Lucide Icons, emoji-picker-react |
| **Backend** | Node.js, Express, Socket.io (WebRTC signaling) |
| **Real-Time** | WebRTC (media streams & data channels) |

## 📋 Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**
- A modern browser supporting WebRTC (Chrome, Firefox, Safari, Edge)

## 🚀 Installation & Setup

### 1. Navigate to the DigiCafe directory
```bash
cd public/DigiCafe
```

### 2. Install All Dependencies
```bash
npm run install-all
```

This installs dependencies for both the server and client.

### 3. Environment Configuration
Copy the example environment files:
```bash
cp client/.env.example client/.env.local
cp server/.env.example server/.env
```

## 🏃 Running the Application

### Development Mode (Local)

Start both the server and client:
```bash
npm run dev
```

Or run them separately in two terminals:

**Terminal 1 - Start Backend Server:**
```bash
npm run dev:server
```

**Terminal 2 - Start Frontend Client:**
```bash
npm run dev:client
```

### Production Build

Build both the frontend and backend:
```bash
npm run build:client
npm run build:server
```

Start the production server:
```bash
npm run start:server
```

## 📸 How to Use

1. **Open the application** in your browser (default: http://localhost:5173)
2. **Allow camera/microphone permissions** when prompted
3. **Create a new room** or join an existing one using a room code
4. **Start a video call** with up to 6 participants
5. **Chat in real-time** using the built-in messaging feature
6. **Share files** by dragging and dropping them into the file sharing area

## 📁 Project Structure

```
DigiCafe/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   └── main.jsx       # Entry point
│   ├── index.html         # HTML template
│   └── package.json
├── server/                 # Node.js signaling server
│   ├── routes/
│   ├── config/
│   └── package.json
├── package.json           # Root workspace configuration
└── README.md
```

## 🌐 Deployment

The application can be deployed on:
- **Vercel** (Frontend)
- **Render** or **Heroku** (Backend)
- **Docker** containers for containerized deployment

See `vercel.json` and `render.yaml` for deployment configurations.

## 🐛 Troubleshooting

### Video/Audio Not Working
- Check browser permissions for camera and microphone
- Ensure WebRTC is supported in your browser
- Check firewall settings for UDP traffic

### Connection Issues
- Verify both server and client are running
- Check that the signaling server URL is correct in `.env.local`
- Ensure ports are not blocked by firewall

### File Sharing Not Working
- Use a modern browser (Chrome, Firefox, Safari, Edge)
- Ensure both peers are connected before sharing files
- Check browser console for any errors

## 👨‍💻 Author

Created as part of the 100 Days 100 Web Projects challenge.

## 📄 License

This project is part of the 100 Days 100 Web Projects repository.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements!
cd server
npm run dev
```

2. Start the React Client
```bash
cd client
npm run dev
```

The application will now be running on `http://localhost:5173`. 

## Usage

1. Open the app and click **Create Room**.
2. Enter your name and copy the instant join link or room code.
3. Share the link with your peers.
4. Peers joining the link will be prompted for their name and instantly added to your Mesh network!

## License

This project is licensed under the MIT License.
