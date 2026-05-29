import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { setupGraphQL } from './graphql';

const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected');

    await setupGraphQL(app);

    const port = env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 API Server running on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
