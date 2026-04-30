import { redisClient } from './redis.client';

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl) {
      await redisClient.set(key, data, { EX: ttl });
    } else {
      await redisClient.set(key, data);
    }
  },

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  },

  async ttl(key: string): Promise<number> {
    return await redisClient.ttl(key);
  },
};
