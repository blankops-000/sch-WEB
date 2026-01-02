# 🚀 Riverside Academy - Frontend-Backend Connection Guide

## Quick Start

### 1. Start Development Environment
```bash
# Double-click this file to start both servers
start-dev.bat
```

### 2. Access Your Application
- **Frontend**: http://localhost:3000/home.html
- **Backend API**: http://localhost:5000
- **Connection Test**: http://localhost:3000/test-connection.html

## Manual Setup

### Backend Setup
```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd Frontend
# Install http-server globally (one time only)
npm install -g http-server

# Start frontend server
http-server -p 3000 -c-1
```

## 🔗 API Endpoints Connected

Your frontend now connects to these backend endpoints:

### Authentication
- `POST /api/auth/login` - Admin login
- Demo credentials: `admin` / `riverside2024`

### Content APIs
- `GET /api/about` - School information
- `GET /api/news` - News articles
- `GET /api/events` - Calendar events
- `GET /api/academics` - Academic programs
- `GET /api/staff` - Faculty information
- `GET /api/policies` - School policies
- `POST /api/contact` - Contact form submissions

## 🎯 Features Working

### ✅ Connected Features
- **Backend Status Indicator** - Shows API and database connection status
- **Admin Authentication** - Login with backend validation + demo fallback
- **Contact Form** - Sends data to backend with fallback
- **Dynamic Content** - Loads data from backend APIs
- **Error Handling** - Graceful fallback when backend is offline

### 🔄 Fallback System
When backend is offline, the frontend automatically:
- Uses demo data for content
- Enables demo authentication
- Shows offline status indicator
- Continues to function normally

## 🛠️ Troubleshooting

### Backend Not Starting?
1. Check if Node.js is installed: `node --version`
2. Install dependencies: `cd Backend && npm install`
3. Check MongoDB Atlas connection in `Backend/sever.js`
4. Run: `npm run dev`

### Frontend Not Loading?
1. Install http-server: `npm install -g http-server`
2. Start server: `http-server -p 3000 -c-1`
3. Open: http://localhost:3000/home.html

### Connection Issues?
1. Open: http://localhost:3000/test-connection.html
2. Click "Test Connection" to diagnose issues
3. Check browser console for errors
4. Ensure both servers are running

## 📱 Usage

### For Users
- Visit http://localhost:3000/home.html
- Browse all school sections
- Use contact form
- Click "Admin Panel" to access admin features

### For Admins
- Click "Admin Panel" or go to `#/login`
- Login with: `admin` / `riverside2024`
- Access dashboard with stats and quick actions
- Logout returns to main website

## 🔧 Development

### File Structure
```
sch WEB/
├── Backend/           # Node.js API server
├── Frontend/          # HTML/React frontend
├── start-dev.bat      # Development startup script
└── SETUP_GUIDE.md     # This file
```

### Key Files
- `Frontend/home.html` - Main SPA application
- `Backend/sever.js` - API server
- `Frontend/test-connection.html` - Connection testing

## 🚀 Production Deployment

For production, you'll need to:
1. Build frontend assets
2. Configure proper CORS settings
3. Use environment variables for API URLs
4. Set up proper authentication
5. Configure HTTPS

## 📞 Support

If you encounter issues:
1. Check the connection test page
2. Verify both servers are running
3. Check browser console for errors
4. Ensure MongoDB Atlas is accessible