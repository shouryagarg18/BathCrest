const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bathcrest';

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
      console.log(`⚠️  Local MongoDB not available (${localErr.message})`);
      console.log('🔄 Falling back to in-memory MongoDB...');
    }

    // Fallback to in-memory MongoDB for development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({ instance: { dbName: 'bathcrest' } });
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
    console.log('📌 Note: Data will not persist between server restarts');
    console.log('💡 Install MongoDB for persistence: https://www.mongodb.com/try/download/community');

    // Auto-seed the in-memory database
    setTimeout(async () => {
      try {
        console.log('🌱 Seeding in-memory database...');
        const { seedDatabase } = require('../utils/seed');
        await seedDatabase();
      } catch (e) {
        console.error('⚠️ Seed error:', e.message);
      }
    }, 500);

  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
