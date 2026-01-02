// config/database.js
const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    // Using your Atlas connection string with improved options
    const mongoURI = 'mongodb+srv://blankops117_db_user:6ImUVF6bbSAU8egs@cluster0.0jx2xtp.mongodb.net/school_db?retryWrites=true&w=majority&appName=Cluster0';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain at least 5 socket connections
      maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
    };

    mongoose.connect(mongoURI, options)
      .then(() => {
        console.log('✅ MongoDB Atlas Connection Successful');
        console.log(`📁 Database: ${mongoose.connection.db.databaseName}`);
        console.log(`📍 Host: ${mongoose.connection.host}`);
      })
      .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('Troubleshooting tips:');
        console.log('1. Check if your IP is whitelisted in Atlas');
        console.log('2. Verify your username and password');
        console.log('3. Check your internet connection');
        console.log('4. Ensure the cluster is running in Atlas');
      });

    // Event listeners
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to Atlas cluster');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from Atlas');
    });

    // Close connection on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  }

  // Get database instance
  getDB() {
    return mongoose.connection.db;
  }

  // Get mongoose connection
  getConnection() {
    return mongoose.connection;
  }
}

module.exports = new Database();