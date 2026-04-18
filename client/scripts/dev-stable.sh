#!/usr/bin/env bash
set -euo pipefail

HOST="${CLIENT_STABLE_HOST:-localhost}"
PORT="${CLIENT_STABLE_PORT:-4173}"

# Prevent stale local stable-mode processes from serving older sessions.
pkill -f "node ./scripts/stable-proxy-server.cjs" >/dev/null 2>&1 || true
pkill -f "vite build --watch --mode development" >/dev/null 2>&1 || true

# Ensure dist is freshly generated before proxy server starts.
npx vite build --mode development

# Keep rebuilding on file changes in the background.
npx vite build --watch --mode development &
BUILD_PID=$!

# Serve built assets and proxy API requests to backend to avoid browser CORS issues.
CLIENT_STABLE_HOST="$HOST" CLIENT_STABLE_PORT="$PORT" node ./scripts/stable-proxy-server.cjs &
PROXY_PID=$!

cleanup() {
  kill "$BUILD_PID" >/dev/null 2>&1 || true
  kill "$PROXY_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

echo "QuoteRush client stable mode running at http://${HOST}:${PORT}"
wait "$PROXY_PID"
