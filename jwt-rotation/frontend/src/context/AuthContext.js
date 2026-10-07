// src/hooks/useAuth.js
//
// Central auth state manager. Wraps the entire app so any component can:
//   - Read current user / loading state
//   - Call login(), logout(), or refreshSession()
//
// On mount: silently tries to restore session via /api/auth/refresh
// (The httpOnly cookie is present if the user was previously logged in)

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance, {
  setAccessToken,
  clearAccessToken,
} from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true during initial session restore

  // ── Restore session on app mount ───────────────────────────────────────────
  // If the user has a valid refresh token cookie, silently get a new access token.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await axiosInstance.post("/api/auth/refresh");
        const { accessToken, user: userData } = response.data.data;

        setAccessToken(accessToken);
        setUser(userData);
      } catch {
        // No valid session — user needs to log in. This is normal.
        clearAccessToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ── Listen for session-expired events from the Axios interceptor ───────────
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      clearAccessToken();
      // You might also redirect here: window.location.href = '/login'
    };

    window.addEventListener("auth:sessionExpired", handleSessionExpired);
    return () => window.removeEventListener("auth:sessionExpired", handleSessionExpired);
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const response = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });

    const { accessToken, user: userData } = response.data.data;
    setAccessToken(accessToken);
    setUser(userData);

    return userData;
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch {
      // Even if logout API fails, clear local state
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for clean usage in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};