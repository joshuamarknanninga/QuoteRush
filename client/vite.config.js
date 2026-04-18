import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const devHost = '127.0.0.1';
const devPort = 5173;

export default defineConfig({
  // Disable Fast Refresh to avoid websocket HMR channel in constrained local networks.
  plugins: [react({ fastRefresh: false }), tailwindcss()],
  server: {
    host: devHost,
    port: devPort,
    strictPort: true,
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
