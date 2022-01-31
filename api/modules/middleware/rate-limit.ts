import type { NextFunction, Request, Response } from 'express';
import rateLimiter from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import redis from '../../infra/redis';
import AppError from '../../util/app-error';

/**
 * Prepares and configures a rate limiter to be used in endpoints to prevent SPAM.
 *
 * @param max - Max number of requests.
 * @param prefix - Prefix to be used as a special key to be stored. Defaults to `common`.
 * @param minutes - Minutes for the rate limiter to be active. Defaults to 15.
 * @returns Rate limiter instance to be used as a middleware before each route.
 */
const rateLimit = (max: number, prefix = 'common', minutes = 15) => {
  const store = new RedisStore({
    client: redis.nodeRedis,
    prefix: `rl-${prefix}`,
  });

  return rateLimiter({
    store,
    max, // max requests in 'windowMs'
    windowMs: minutes * 60 * 1000, // `minutes` number of minutes
    handler(_: Request, __: Response, next: NextFunction) {
      next(
        new AppError(
          `Too many requests! Please try again in ${minutes} minute(s)!`,
          429
        )
      );
    },
  });
};

export default rateLimit;
