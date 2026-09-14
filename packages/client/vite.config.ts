import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  cacheDir: '../../node_modules/.vite/client',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    }
  }
})
