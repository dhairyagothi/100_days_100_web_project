/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'scale-in-view': {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        'scale-in-view': 'scale-in-view 0.5s ease-in-out forwards',
      }
    },
  },
  plugins: [],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
}
