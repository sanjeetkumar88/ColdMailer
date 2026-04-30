import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { ioredisClient } from '../../cache/redis.client';

/**
 * General API Rate Limiter
 * Limits each IP to 100 requests per 15 minutes
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: new RedisStore({
    // @ts-expect-error - ioredis and rate-limit-redis type mismatch sometimes occurs but works at runtime
    sendCommand: (...args: string[]) => ioredisClient.call(...args),
  }),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

/**
 * Stricter Rate Limiter for Authentication routes
 * Limits each IP to 10 attempts per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis and rate-limit-redis type mismatch
    sendCommand: (...args: string[]) => ioredisClient.call(...args),
    prefix: 'rl-auth:',
  }),
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes',
  },
});
