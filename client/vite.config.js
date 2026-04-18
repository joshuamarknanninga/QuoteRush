import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const devHost = process.env.VITE_DEV_HOST || 'localhost';
const devPort = Number(process.env.VITE_DEV_PORT || 5173);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: devHost,
    port: devPort,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: process.env.VITE_HMR_HOST || devHost,
      port: Number(process.env.VITE_HMR_PORT || devPort),
      clientPort: Number(process.env.VITE_HMR_CLIENT_PORT || devPort),
      timeout: 120000,
      overlay: true
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  test: {
    environment: 'jsdom'
  }
});
