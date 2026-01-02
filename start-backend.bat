@echo off
echo Starting Outering Schools Backend Server...
cd Backend
start "Backend Server" cmd /k "npm install && npm start"
cd ..
echo Opening frontend platform...
start "" "home.html"