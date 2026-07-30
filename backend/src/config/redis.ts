import { createClient } from 'redis';
import { config } from './index';
import { logger } from './logger';

export const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis connected successfully'));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
