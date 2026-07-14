const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const uri = process.env.MONGODB_URI || 'mongodb://shouryagarg1808_db_user:FO2uKXmmYDGl4bK4@ac-qi0zfhq-shard-00-00.pvdhewc.mongodb.net:27017,ac-qi0zfhq-shard-00-01.pvdhewc.mongodb.net:27017,ac-qi0zfhq-shard-00-02.pvdhewc.mongodb.net:27017/bathcrest?ssl=true&authSource=admin&retryWrites=true&w=majority';

    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      // Seed if empty
      setTimeout(async () => {
        try {
          const Product = require('../models/Product');
          const count = await Product.countDocuments();
          if (count === 0) {
            console.log('🌱 Seeding database...');
            const { seedDatabase } = require('../utils/seed');
            await seedDatabase();
          }
        } catch (e) { /* optional */ }
      }, 500);
      return;
    } catch (localErr) {
      console.error(`❌ MongoDB connection error: ${localErr.message}`);
      console.error('⚠️ Did you forget to allow 0.0.0.0/0 in MongoDB Atlas Network Access?');
      process.exit(1);
    }

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
