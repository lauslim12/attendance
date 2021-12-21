import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import type { WrappedNodeRedisClient } from 'handy-redis';
import helmet from 'helmet';
import hpp from 'hpp';
import RedisStore from 'rate-limit-redis';

import errorHandler from '../modules/error';
import HealthHandler from '../modules/health/handler';
import AppError from '../util/app-error';

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

  // Define handlers by constructing them with our services.
  const healthHandler = HealthHandler();

  // Define API routes.
  app.use(throttler, limiter);
  app.use('/api/v1', healthHandler);

  // Catch-all routes for API.
  app.all('*', (req: Request, _: Response, next: NextFunction) => {
    next(new AppError(`Cannot find '${req.originalUrl}' on this server!`, 404));
  });

  // Define error handlers.
  app.use(errorHandler);

  return app;
}

export default loadExpress;
