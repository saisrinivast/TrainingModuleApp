// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 👈 important for Vercel
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
});
