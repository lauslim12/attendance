import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import rateLimit from 'express-rate-limit';
import type { CookieOptions } from 'express-session';
import session from 'express-session';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import RedisStore from 'rate-limit-redis';

import config from '../config';
import AttendanceHandler from '../modules/attendance/handler';
import AuthHandler from '../modules/auth/handler';
import errorHandler from '../modules/error';
import HealthHandler from '../modules/health/handler';
import SessionHandler from '../modules/session/handler';
import UserHandler from '../modules/user/handler';
import AppError from '../util/app-error';
import redis from './redis';

/**
 * Loads an Express application.
 */
function loadExpress() {
  // Create Express application.
  const app = express();

  // Allow proxies on our nginx server in production.
  if (config.NODE_ENV === 'production') {
    app.enable('trust proxy');
  }

  // Security headers.
  app.use(helmet());

  // Load JSON parser and signed cookie parser.
  app.use(express.json({ type: 'application/json', limit: '512b' }));
  app.use(cookieParser(config.COOKIE_SECRET));

  // Prevent parameter pollution.
  app.use(hpp());

  // Use logging on application.
  if (config.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  // Only allow the following methods: [OPTIONS, HEAD, CONNECT, GET, POST, PATCH, PUT, DELETE].
  app.use((req: Request, _: Response, next: NextFunction) => {
    const allowedMethods = [
      'OPTIONS',
      'HEAD',
      'CONNECT',
      'GET',
      'POST',
      'PATCH',
      'PUT',
      'DELETE',
    ];

    if (!allowedMethods.includes(req.method)) {
      next(
        new AppError(`Method ${req.method} is not allowed in this API!`, 405)
      );
      return;
    }

    next();
  });

  // Prepare cookie options.
  const sessOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400 * 1000, // 1 day
    // maxAge: 60000, // 60 seconds
  };

  // Inject 'secure' attributes on production environment.
  app.use((req: Request, _: Response, next: NextFunction) => {
    sessOptions.secure =
      req.secure || req.headers['x-forwarded-proto'] === 'https';

    next();
  });

  // Prepare to use Express Sessions.
  const RedisSessionStore = connectRedis(session);
  app.use(
    session({
      store: new RedisSessionStore({ client: redis.nodeRedis }),
      name: config.SESSION_COOKIE,
      saveUninitialized: false,
      resave: false,
      secret: config.COOKIE_SECRET,
      cookie: sessOptions,
    })
  );

  // Set up throttling to prevent spam requests.
  const throttler = slowDown({
    store: new RedisStore({
      client: redis.nodeRedis,
      prefix: 'sd-common',
    }),
    delayAfter: 50, // start to delay by 'delayMs' after 'delayAfter' requests has been made in 'windowMs'
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayMs: 200,
  });

  // Set up general limiter.
  const limiter = rateLimit({
    store: new RedisStore({
      client: redis.nodeRedis,
      prefix: 'rl-common',
    }),
    max: 75, // max requests in 'windowMs'
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
    max: 20, // max requests in 'windowMs'
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
  const attendanceHandler = AttendanceHandler();
  const authHandler = AuthHandler(strictLimiter);
  const healthHandler = HealthHandler();
  const sessionHandler = SessionHandler();
  const userHandler = UserHandler();

  // Define API routes.
  app.use('/api', throttler);
  app.use('/api/v1', healthHandler);
  app.use('/api/v1/attendance', strictLimiter, attendanceHandler);
  app.use('/api/v1/auth', authHandler);
  app.use('/api/v1/sessions', strictLimiter, sessionHandler);
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
