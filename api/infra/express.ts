import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import RedisStore from 'rate-limit-redis';

import config from '../config';
import AuthHandler from '../modules/auth/handler';
import errorHandler from '../modules/error';
import HealthHandler from '../modules/health/handler';
import UserHandler from '../modules/user/handler';
import AppError from '../util/app-error';
import redis from './redis';

/**
 * Loads an Express application.
 */
function loadExpress() {
  // Create Express copy.
  const app = express();

  // Load middlewares.
  app.use(express.json({ type: 'application/json', limit: '512b' }));
  app.use(helmet());
  app.use(hpp());

  // Use logging on application.
  if (config.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  // Prepare to parse signed cookies (for our JWS).
  app.use(cookieParser(config.COOKIE_SECRET));

  // Prepare to use Express Sessions.
  const RedisSessionStore = connectRedis(session);
  app.use(
    session({
      store: new RedisSessionStore({ client: redis.nodeRedis }),
      name: 'attendance-sid',
      saveUninitialized: false,
      resave: false,
      secret: config.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 * 100, // 1 day
      },
    })
  );

  // Set up throttling to prevent spam requests.
  const throttler = slowDown({
    store: new RedisStore({
      client: redis.nodeRedis,
      prefix: 'sd-common',
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
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
    windowMs: 15 * 60 * 1000, // 15 minutes
    handler(_: Request, __: Response, next: NextFunction) {
      next(new AppError('Too many requests! Please try again later!', 429));
    },
  });

  // Set up specific limiter.
  const strictLimiter = rateLimit({
    store: new RedisStore({
      client: redis.nodeRedis,
      prefix: 'rl-sensitive',
    }),
    max: 10,
    windowMs: 5 * 60 * 1000, // 5 minutes
    handler(_: Request, __: Response, next: NextFunction) {
      next(
        new AppError(
          'Too many requests for this endpoint! Please try again later!',
          429
        )
      );
    },
  });

  // Define handlers.
  const authHandler = AuthHandler();
  const healthHandler = HealthHandler();
  const userHandler = UserHandler();

  // Define API routes.
  app.use(throttler);
  app.use('/api/v1', healthHandler);
  app.use('/api/v1/auth', strictLimiter, authHandler);
  app.use('/api/v1/users', limiter, userHandler);

  // Catch-all routes for API.
  app.all('*', (req: Request, _: Response, next: NextFunction) => {
    next(new AppError(`Cannot find '${req.originalUrl}' on this server!`, 404));
  });

  // Define error handlers.
  app.use(errorHandler);

  return app;
}

export default loadExpress;
