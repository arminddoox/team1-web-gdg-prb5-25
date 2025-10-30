import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'frontend', // Add this line
  plugins: [react()],
  build: {
    outDir: '../dist', // Build output to root/dist
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend port
        changeOrigin: true,
      }
    }
  }
})
