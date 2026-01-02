@echo off
echo Starting Riverside Academy Development Environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Start Backend Server
echo Starting Backend Server...
cd Backend
start "Backend Server" cmd /k "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend (using a simple HTTP server)
echo Starting Frontend Server...
cd Frontend

REM Check if http-server is installed globally
http-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing http-server globally...
    npm install -g http-server
)

start "Frontend Server" cmd /k "http-server -p 3000 -c-1"
cd ..

echo.
echo ================================
echo Development Environment Started!
echo ================================
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:3000
echo.
echo Open your browser and go to:
echo http://localhost:3000/home.html
echo.
echo Press any key to close this window...
pause >nul