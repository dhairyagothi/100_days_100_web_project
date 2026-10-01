import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Singleton socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  // Send the stored JWT on every (re)connect so the server can authenticate the socket
  auth: (cb) => {
    let token = "";
    try {
      token = (JSON.parse(localStorage.getItem("jbUser")) || {}).token || "";
    } catch {
      token = "";
    }
    cb({ token });
  },
});

export default socket;
