const express    = require("express");
const http       = require("http");
const { Server } = require("socket.io");
const mongoose   = require("mongoose");
const cors       = require("cors");
const jwt        = require("jsonwebtoken");
const User       = require("./models/User");
require("dotenv").config();

const app    = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes
app.set("io", io);

// Authenticate the socket from the JWT handshake; anonymous connections are still allowed for public events
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = await User.findById(id).select("-password");
  } catch {
    // Invalid token: continue as an anonymous connection
  }
  next();
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));

// Health check
app.get("/", (req, res) =>
  res.json({ message: "MERN Job Board API running ✅", realtime: "Socket.io active ⚡" })
);

// Socket.io connection handler
let onlineUsers = 0;
io.on("connection", (socket) => {
  onlineUsers++;
  io.emit("onlineCount", onlineUsers);
  console.log(`⚡ User connected: ${socket.id} | Online: ${onlineUsers}`);

  // Join the authenticated employer to their own room only (server-derived, not client-supplied)
  const authedUser = socket.data.user;
  if (authedUser && authedUser.role === "employer") {
    socket.join(`employer_${authedUser._id}`);
  }

  socket.on("disconnect", () => {
    onlineUsers = Math.max(0, onlineUsers - 1);
    io.emit("onlineCount", onlineUsers);
    console.log(`❌ User disconnected: ${socket.id} | Online: ${onlineUsers}`);
  });
});

// Connect DB & start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () =>
      console.log(`🚀 Server + Socket.io on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB error:", err.message);
    process.exit(1);
  });
