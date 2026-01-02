@echo off
echo Starting Riverside Academy Full Stack Application...
echo.
echo Starting Backend Server...
start cmd /k "cd Backend && npm install && npm start"
timeout /t 3 /nobreak >nul
echo.
echo Starting Frontend Server...
start cmd /k "cd Frontend && npm start"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause