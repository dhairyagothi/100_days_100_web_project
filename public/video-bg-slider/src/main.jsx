/**
 * main.jsx
 * ─────────────────────────────────────────────────────────────
 * React 18 entry point.
 * - Imports global CSS (Tailwind directives + base resets)
 * - Mounts <App /> into the #root div defined in index.html
 * ─────────────────────────────────────────────────────────────
 */
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css"; // ← must come after React imports so Vite processes it

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);