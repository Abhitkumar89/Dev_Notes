import mongoose from 'mongoose';

/**
 * Connect to MongoDB using Mongoose.
 * Exits the process on a fatal connection error so the platform can restart it.
 */
export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[db] MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[db] MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
