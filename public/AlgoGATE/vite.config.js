import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Use the function form so we can call loadEnv for the current mode.
// • `npm run build`            → mode "production" → base = '/'    (Vercel)
// • `npm run build:gh`         → mode "ghpages"    → base = '/AlgoGATE/' (GitHub Pages)
// • `npm run dev`              → mode "development" → base = '/'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_APP_BASE || '/'

  return {
    plugins: [react()],
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
      // Serve the resources folder as /resources in dev
      fs: {
        allow: ['..'],
      },
    },
    publicDir: 'public',
  }
})
