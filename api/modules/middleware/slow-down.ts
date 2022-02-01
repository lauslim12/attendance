import expressSlowDown from 'express-slow-down';
import RedisStore from 'rate-limit-redis';

import redis from '../../infra/redis';

/**
 * Creates an instance of `express-slow-down` with Redis to be used globally.
 *
 * @param delayAfter - Number of requests before being throttled.
 * @returns Instance of `express-slow-down`.
 */
const slowDown = (delayAfter: number) => {
  const store = new RedisStore({
    client: redis.nodeRedis,
    prefix: 'sd-common',
  });

  return expressSlowDown({
    store,
    delayAfter, // start to delay by 'delayMs' after 'delayAfter' requests has been made in 'windowMs'
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayMs: 200,
  });
};

export default slowDown;
