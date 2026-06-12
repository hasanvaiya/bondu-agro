@echo off
echo ==========================================================
echo       Bondu Agro - Farm Management Local Server
echo ==========================================================
echo.
echo Starting local server at: http://localhost:8000
echo.
echo Server run logic: python -m http.server 8000
echo.
echo Press Ctrl+C in this terminal window to stop the server.
echo ==========================================================
echo.
start "" "http://localhost:8000"
python -m http.server 8000
