import type { Request, Response } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import type { WrappedNodeRedisClient } from 'handy-redis';
import helmet from 'helmet';
import hpp from 'hpp';
import RedisStore from 'rate-limit-redis';

/**
 * Loads an Express application.
 *
 * @param redis - Redis instance to be plugged into the app
 */
function loadExpress(redis: WrappedNodeRedisClient) {
  // Create Express copy.
  const app = express();

  // Load middlewares.
  app.use(express.json({ type: 'application/json', limit: '512b' }));
  app.use(helmet());
  app.use(hpp());

  // Set up throttling to prevent spam requests.
  const throttler = slowDown({
    store: new RedisStore({
      client: redis.nodeRedis,
      prefix: 'sd-common',
    }),
    windowMs: 15 * 60 * 1000,
    delayAfter: 25,
    delayMs: 200,
  });

  // Set up general limiter.
  const limiter = rateLimit({
    store: new RedisStore({
      client: redis.nodeRedis,
      prefix: 'rl-common',
    }),
    max: 50,
    windowMs: 15 * 60 * 1000,
  });

  // Set up specific limiter.
  // const strictLimiter = rateLimit({
  //   store: new RedisStore({
  //     client: redis.nodeRedis,
  //     prefix: 'rl-sensitive',
  //   }),
  //   max: 10,
  //   windowMs: 5 * 60 * 1000,
  // });

  // Define API routes.
  app.use(throttler);
  app.use(limiter);
  app.get('/api/v1', (_: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to Attendance API!',
    });
  });

  return app;
}

export default loadExpress;
