/** @type {import('tailwindcss').Config} */
export default {
  // ── Purge paths ────────────────────────────────────────────
  // Tailwind scans these files and removes unused utility classes in production.
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      // ── Custom font (loaded via Google Fonts in index.html) ─
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },

      // ── Colour palette extension ────────────────────────────
      colors: {
        // Amber accent used throughout the slider UI
        accent: {
          DEFAULT: "#FBBF24", // amber-400
          hover:   "#F59E0B", // amber-500
          dark:    "#0a0a0a", // text on amber bg
        },
      },

      // ── Custom keyframes ────────────────────────────────────
      keyframes: {
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 1.2s linear infinite",
        "fade-in":   "fade-in 0.5s ease forwards",
      },
    },
  },

  plugins: [],
};