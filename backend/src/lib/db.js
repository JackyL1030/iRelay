import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is required');
    }
    const conn = await mongoose.connect(mongoUri);

    console.log('MongoDB connected', conn.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
    //1 means failed, 0 means success
  }
}
