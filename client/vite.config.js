import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const devHost = process.env.VITE_DEV_HOST || '127.0.0.1';
const devPort = Number(process.env.VITE_DEV_PORT || 5173);
const hmrHost = process.env.VITE_HMR_HOST || devHost;
const hmrPort = Number(process.env.VITE_HMR_PORT || devPort);
const hmrClientPort = Number(process.env.VITE_HMR_CLIENT_PORT || devPort);
const hmrProtocol = process.env.VITE_HMR_PROTOCOL || 'ws';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: devHost,
    port: devPort,
    strictPort: true,
    hmr: {
      protocol: hmrProtocol,
      host: hmrHost,
      port: hmrPort,
      clientPort: hmrClientPort
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
