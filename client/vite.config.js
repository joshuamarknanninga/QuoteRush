import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const disableHmr = process.env.VITE_DISABLE_HMR === 'true';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    hmr: disableHmr
      ? false
      : {
          protocol: 'ws',
          host: '127.0.0.1',
          port: 5173,
          clientPort: 5173
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
