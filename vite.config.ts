import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Semua request /api diteruskan ke backend Express (port 3001)
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
    // Izinkan akses dari Cloudflare Tunnel (URL *.trycloudflare.com)
    allowedHosts: ['.trycloudflare.com', 'localhost'],
  },
})
