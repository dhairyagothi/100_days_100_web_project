// src/api/axiosInstance.js
//
// This is the single Axios instance used for ALL API calls in the app.
//
// ── Why a shared instance? ────────────────────────────────────────────────────
// We attach a response interceptor that automatically handles 401 errors by:
//   1. Pausing the failed request
//   2. Firing ONE refresh request (even if 10 requests failed simultaneously)
//   3. Retrying ALL queued requests with the new access token
//
// This means UI components NEVER need to manually handle token expiry.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

// ── In-memory token store ─────────────────────────────────────────────────────
// Access token lives in memory (NOT localStorage) to prevent XSS theft.
// It's lost on page refresh, which is fine — the refresh endpoint restores it.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

// ── Axios instance ────────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  withCredentials: true, // ← CRITICAL: sends httpOnly cookies on every request
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Automatically inject the access token into every request header.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — Token Refresh Logic ────────────────────────────────
//
// State for managing concurrent refresh attempts:
//   isRefreshing     → true while a refresh is in-flight (prevents multiple calls)
//   failedQueue      → holds resolve/reject for requests that arrived while refreshing
//
let isRefreshing = false;
let failedQueue = [];

// Drain the queue: resolve with new token (retry) or reject with error (fail)
const processQueue = (error, token = null) => {
  failedQueue.forEach((pending) => {
    if (error) {
      pending.reject(error);
    } else {
      pending.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  // Pass successful responses straight through
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors that we haven't already retried
    // _retry flag prevents infinite retry loops
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh if the failing request IS the refresh endpoint
    // (that would cause an infinite loop if refresh itself returns 401)
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      clearAccessToken();
      // Redirect to login — all sessions are gone
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // ── A refresh is already in-flight ────────────────────────────────────
    // Queue this request to be retried once the refresh completes.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      });
    }

    // ── Start the refresh process ──────────────────────────────────────────
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // The httpOnly cookie is sent automatically via withCredentials: true
      const response = await axiosInstance.post("/api/auth/refresh");
      const newAccessToken = response.data.data.accessToken;

      // Store new token in memory
      setAccessToken(newAccessToken);

      // Update the Authorization header for the original failed request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      // Drain the queue: all waiting requests get the new token
      processQueue(null, newAccessToken);

      // Retry the original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed — session is truly over
      processQueue(refreshError, null);
      clearAccessToken();

      // Emit a custom event so auth context can update UI state
      window.dispatchEvent(new CustomEvent("auth:sessionExpired"));

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
