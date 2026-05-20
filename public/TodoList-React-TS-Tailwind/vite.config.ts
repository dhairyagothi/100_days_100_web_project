import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/public/Todolist-React-TS-Tailwind/',
  css: {
    postcss: './postcss.config.js',
  },
})