import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Explorex/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    strictPort: false,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5005',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/server/**', '**/scripts/**', '**/data/**'],
    },
  },
})
