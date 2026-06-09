import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Base path ──────────────────────────────────────────────
  // If you want to serve the app under a sub-path, set it here.
  // Example: base: "/travel_website/" → http://192.168.x.x:3000/travel_website/
  // Leave as "/" (default) to serve at root: http://192.168.x.x:3000/
  base: "/",

  server: {
    port: 3000,

    // host: true exposes the dev server on your LAN IP (192.168.x.x)
    // Required to access from other devices or via network IP.
    // Without this, Vite only binds to localhost.
    host: true,

    open: false, // set true to auto-open browser on `npm run dev`
  },

  // Ensure large video files in /public are served without size warnings
  build: {
    assetsInlineLimit: 0,
  },
});