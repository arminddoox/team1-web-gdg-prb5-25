import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', 'VITE_')

  return {
    root: 'frontend',
    envDir: '..',
    plugins: [react()],
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    server: {
      allowedHosts: [
        'ba2f5fde5e0e.ngrok-free.app', // host ngrok hiện tại
        '*.ngrok-free.app',            // wildcard phòng hờ
        'animated-guide-7vwx5qxj99wqf475-5173.app.github.dev' // GitHub Codespaces
      ],
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})