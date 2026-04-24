import { connectDB } from './config/db';
import './workers/index';       // registers campaign + email workers
import { registerAllListeners } from './events/listeners/index';

const startWorker = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected (Worker)');

    registerAllListeners();
    console.log('🚀 Workers & Listeners running');
  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
};

startWorker();
