import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/you-try-surface-area-/',
  server: {
    port: 8080,
    host: '0.0.0.0',
    strictPort: true,
    open: true
  }
})