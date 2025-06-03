/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Here
    cors: true,
    proxy: {
      '^/randomWords.*': {
        target: "http://api.wordnik.com/v4/words.json/",
        changeOrigin: true
      },
    }
  },
  test: {
    // reporters: ['html'],
    environment: 'jsdom',
    css: true,
  }
})
