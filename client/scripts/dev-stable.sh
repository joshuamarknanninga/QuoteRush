#!/usr/bin/env bash
set -euo pipefail

HOST="${CLIENT_STABLE_HOST:-localhost}"
PORT="${CLIENT_STABLE_PORT:-4173}"

# Prevent stale local Vite preview processes from serving older sessions.
pkill -f "vite preview --host ${HOST} --port ${PORT}" >/dev/null 2>&1 || true

# Ensure dist is freshly generated before preview starts.
npx vite build --mode development

# Keep rebuilding on file changes in the background.
npx vite build --watch --mode development &
BUILD_PID=$!

cleanup() {
  kill "$BUILD_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

echo "QuoteRush client stable mode running at http://${HOST}:${PORT}"
npx vite preview --host "$HOST" --port "$PORT" --strictPort
