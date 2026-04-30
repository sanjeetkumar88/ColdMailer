import { createClient } from 'redis';
import Redis from 'ioredis';
import { env } from '../config/env';

const redisUrl = env.REDIS_URL;

// Client for general cache (using 'redis' package as requested)
export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis Client Connected');
  } catch (err) {
    console.error('❌ Redis Connection Failed:', err);
  }
})();

// ioredis instance for BullMQ compatibility
export const ioredisClient = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

ioredisClient.on('error', (err) => {
  console.error('❌ ioredis Connection Error:', err);
});

ioredisClient.on('connect', () => {
  console.log('✅ ioredis Connected');
});
