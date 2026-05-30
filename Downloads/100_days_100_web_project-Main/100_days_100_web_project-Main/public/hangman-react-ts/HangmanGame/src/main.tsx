import React from "react";
import { createRoot } from "react-dom/client";
import Game from "./components/Game";
import "./styles/main.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>
);
