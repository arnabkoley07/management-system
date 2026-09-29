@echo off
echo ==============================================
echo   Visitor Registration System Launcher
echo ==============================================

echo [1/3] Clearing any previous processes on port 5000 and 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo [2/3] Starting Backend Server (Port 5000)...
start "Visitor Backend API" cmd /k "cd backend && npm start"

echo [3/3] Starting Frontend Dev Server (Port 5173)...
start "Visitor Frontend App" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched successfully!
echo Backend API : http://localhost:5000
echo Frontend App: http://localhost:5173
echo ==============================================
