// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/about');
const eventRoutes = require('./routes/events');
const newsRoutes = require('./routes/news');
const academicRoutes = require('./routes/academic');
const policyRoutes = require('./routes/policy');
const staffRoutes = require('./routes/staff');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

// Import middleware
const errorHandler = require('./middleware/errorhandling');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection - USING YOUR ATLAS CONNECTION STRING
const mongoURI = 'mongodb+srv://blankops117_db_user:6ImUVF6bbSAU8egs@cluster0.0jx2xtp.mongodb.net/school_db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('✅ MongoDB Atlas connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('Please check your Atlas connection string and network settings');
});

// Connection events
mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose connected to Atlas cluster');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'School Website API',
    version: '1.0.0',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      contact: '/api/contact',
      about: '/api/about',
      events: '/api/events',
      news: '/api/news',
      academics: '/api/academics',
      policies: '/api/policies',
      handbooks: '/api/handbooks',
      staff: '/api/staff',
      auth: '/api/auth',
      upload: '/api/upload'
    }
  });
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/policies', policyRoutes);

app.use('/api/staff', staffRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? 'Connected to Atlas' : 'Connecting...'}`);
});