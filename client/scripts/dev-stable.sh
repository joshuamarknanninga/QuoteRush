#!/usr/bin/env bash
set -euo pipefail

# Prevent stale local Vite processes from serving old HMR-enabled sessions.
pkill -f "vite.*--host localhost --port 5173" >/dev/null 2>&1 || true
pkill -f "vite" >/dev/null 2>&1 || true

npx vite build --watch --mode development &
BUILD_PID=$!

cleanup() {
  kill "$BUILD_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

npx vite preview --host localhost --port 5173 --strictPort
