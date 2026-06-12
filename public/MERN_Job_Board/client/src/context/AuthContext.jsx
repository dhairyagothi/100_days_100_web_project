import { createContext, useState, useContext, useEffect } from "react";
import socket from "../socket/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("jbUser")) || null; } catch { return null; }
  });
  const [toasts, setToasts] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  };

  const login = (data) => {
    localStorage.setItem("jbUser", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("jbUser");
    setUser(null);
    socket.disconnect();
  };

  // Connect socket when user logs in
  useEffect(() => {
    if (user) {
      socket.connect();

      // Employer rooms are joined server-side from the authenticated socket handshake

      socket.on("onlineCount", (count) => setOnlineCount(count));

      // Live notification: new application received
      socket.on("newApplication", ({ candidateName, jobTitle }) => {
        addToast(`⚡ ${candidateName} applied for "${jobTitle}"`, "success");
      });

      return () => {
        socket.off("onlineCount");
        socket.off("newApplication");
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, addToast, toasts, onlineCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
