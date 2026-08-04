#!/bin/bash
cd "$(dirname "$0")"

PY=""
if command -v python3 >/dev/null 2>&1; then
  PY="python3"
elif command -v python >/dev/null 2>&1; then
  PY="python"
else
  echo "Python was not found."
  echo "Install Python 3, or open index.html in Safari/Chrome."
  read -r -p "Press Enter to close…"
  exit 1
fi

echo "Starting DANK STREET review server at http://127.0.0.1:8080"
echo "Press Ctrl+C to stop."
open "http://127.0.0.1:8080" 2>/dev/null || true
exec "$PY" -m http.server 8080
