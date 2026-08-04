@echo off
setlocal
cd /d "%~dp0"

set "PY="
where python >nul 2>&1 && set "PY=python"
if not defined PY where py >nul 2>&1 && set "PY=py -3"
if not defined PY (
  echo Python was not found.
  echo Install Python from https://www.python.org/downloads/ or open index.html in your browser.
  pause
  exit /b 1
)

echo Starting DANK STREET review server at http://127.0.0.1:8080
echo Press Ctrl+C to stop.
start "" "http://127.0.0.1:8080"
%PY% -m http.server 8080
