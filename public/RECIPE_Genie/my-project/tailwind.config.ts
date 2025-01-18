import type { Config } from "tailwindcss";

// Define the Catppuccin color palette
const catppuccinColors = {
  latte: {
    base: "#eff1f5",
    mantle: "#e6e9ef",
    text: "#4c4f69",
    overlay1: "#dce0e8",
    lavender: "#7287fd",
    peach: "#f2cdcd",
    rosewater: "#f4dbd6",
  },
  mocha: {
    base: "#1e1e2e",
    mantle: "#181825",
    text: "#cdd6f4",
    overlay1: "#6c7086",
    lavender: "#b4befe",
    peach: "#fab387",
    rosewater: "#f5e0dc",
  },
};

// Tailwind CSS Config
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: catppuccinColors, // Add Catppuccin colors here
      animation: {
        bounce:
          "bounce 0.5s alternate cubic-bezier(0.95, 0.05, 0.795, 0.035) infinite",
        slideUpCubicbezier: "slideUp 1s cubic-bezier(0.165, 0.84, 0.44, 1)",
      },
      keyframes: {
        bounce: {
          from: { transform: "translateY(10px)" },
          to: { transform: "translateY(0)" },
        },
        slideIp : {
          from: {transform: "translateY(10px)" },
          to: {transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
