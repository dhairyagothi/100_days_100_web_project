const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io and allow connections from your frontend development server
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || 'https://yourdomain.com' : "*",
    methods: ["GET", "POST"]
  }
});

// Endpoint to generate a unique shareable chat session link
app.get('/api/room/create', (req, res) => {
  const roomId = uuidv4();
  res.json({ roomId: roomId, url: `/chat/${roomId}` });
});

// Socket.io Realtime Logic
io.on('connection', (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`User connected: ${socket.id}`);
  }

  // 1. User requests to join a specific collaborative session
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`User ${socket.id} joined room: ${roomId}`);
    }

    // Notify others in the room that someone joined
    socket.to(roomId).emit('user_joined', { userId: socket.id });
  });

  // 2. Listen for chat messages sent from a user in a room
  socket.on('send_message', (data) => {
    // Validate payload
    if (
      !data ||
      typeof data.room !== 'string' ||
      data.room.trim() === ''
    ) {
      return;
    }

    // Ensure sender belongs to the target room
    if (!socket.rooms.has(data.room)) {
      return;
    }

    socket.to(data.room).emit('receive_message', data);
  });

  // 3. Handle user disconnection
  socket.on('disconnect', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`User disconnected: ${socket.id}`);
    }
  });
});

const PORT = process.env.PORT || 5000;
app.use(express.static(__dirname));
app.get('/chat/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'chatbot.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
