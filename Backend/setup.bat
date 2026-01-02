@echo off
echo Setting up School Website Backend...

:: Create directory structure
mkdir config
mkdir controllers
mkdir models
mkdir routes
mkdir middleware
mkdir utils
mkdir uploads
mkdir uploads\news
mkdir uploads\documents
mkdir uploads\staff

:: Initialize package.json
npm init -y

:: Install dependencies
echo Installing dependencies...
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer nodemailer express-validator
npm install -D nodemon

echo Setup complete!
echo Run 'npm run dev' to start the server
pause