import { createNodeRedisClient } from 'handy-redis';

/**
 * Creates a Redis instance to be used by the application.
 *
 * @returns Redis instance
 */
function loadRedis() {
  const redis = createNodeRedisClient();

  /**
   * Set up pub/sub listeners.
   */
  redis.nodeRedis.on('error', (err) =>
    console.error('An error occurred when setting up Redis. Error:', err)
  );
  redis.nodeRedis.on('connect', () =>
    console.log('Successfully connected to the Redis instance!')
  );
  redis.nodeRedis.on('ready', () => console.log('Redis is now ready to work!'));

  return redis;
}

export default loadRedis;
