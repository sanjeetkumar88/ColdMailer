import Redis from 'ioredis';
import { env } from '../config/env';

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT, 10),
  maxRetriesPerRequest: null, // Required for BullMQ
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected');
});
