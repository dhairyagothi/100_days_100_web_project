import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { JobProvider } from "./context/JobContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <JobProvider>
        <App />
      </JobProvider>
    </AuthProvider>
  </React.StrictMode>
);
