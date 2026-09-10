@echo off
title SMART TRANSIT COMMAND - SIH 2026
echo ========================================================
echo   Starting SMART TRANSIT COMMAND (SIH 2026)
echo   Connected Intelligence for Safer, Faster & Smarter Transportation
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/2] Opening browser to http://localhost:3000 ...
start "" "http://localhost:3000"

echo [2/2] Launching Vite Development Server with Groq AI ...
echo.
npm.cmd run dev
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Trying alternative launch with npx vite ...
    npx.cmd vite --port 3000 --host
)
pause
