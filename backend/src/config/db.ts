import mongoose from 'mongoose';
import logger from './logger';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    logger.error(`Error Connecting to DB: ${err.message}`);
    process.exit(1);
  }
};
