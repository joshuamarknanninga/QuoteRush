const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const host = process.env.CLIENT_STABLE_HOST || 'localhost';
const port = Number(process.env.CLIENT_STABLE_PORT || 4173);
const apiTarget = process.env.CLIENT_API_PROXY_TARGET || 'http://localhost:5000';
const distDir = path.resolve(__dirname, '../dist');

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: apiTarget,
    changeOrigin: true,
    secure: false
  })
);

app.use(express.static(distDir));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, host, () => {
  console.log(`Stable client proxy running at http://${host}:${port}`);
  console.log(`Proxying /api to ${apiTarget}`);
});
