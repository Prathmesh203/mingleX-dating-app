const mongoose = require('mongoose');

require('dotenv').config(); 

async function dbConnection() {
  try {
    const url = process.env.MONGODB_URL; // Use environment variable
    if (!url) {
      throw new Error('MONGODB_URL is not defined in the environment variables');
    }
    await mongoose.connect(url);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit process on failure
  }
}

module.exports = dbConnection;