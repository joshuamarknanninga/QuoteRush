import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    // HMR websocket is disabled by default because some local/proxied
    // environments block WS upgrade and spam browser console errors.
    hmr: false,
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  test: {
    environment: 'jsdom'
  }
});
