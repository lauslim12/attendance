import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
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
  app.use(
    helmet({
      frameguard: {
        action: 'deny',
      },
    })
  );

  // Load signed cookie parser. JSON parser is loaded in each required
  // endpoints in a case-by-case basis.
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

  // Send 204 on icon requests.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end();
      return;
    }

    next();
  });

  // Prepare cookie options.
  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7200 * 1000, // 2 hours that will be refreshed every time the user hits a 'has-session' middleware.
  };

  // Inject 'secure' attributes on production environment.
  app.use((req: Request, _: Response, next: NextFunction) => {
    options.secure = req.secure || req.headers['x-forwarded-proto'] === 'https';

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
      cookie: options,
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

  // Define handlers.
  const attendanceHandler = AttendanceHandler();
  const authHandler = AuthHandler();
  const healthHandler = HealthHandler();
  const sessionHandler = SessionHandler();
  const userHandler = UserHandler();

  // Define API routes.
  app.use('/api', throttler);
  app.use('/api/v1', healthHandler);
  app.use('/api/v1/attendance', attendanceHandler);
  app.use('/api/v1/auth', authHandler);
  app.use('/api/v1/sessions', sessionHandler);
  app.use('/api/v1/users', userHandler);

  // Catch-all routes for API.
  app.all('*', (req: Request, _: Response, next: NextFunction) => {
    next(new AppError(`Cannot find '${req.originalUrl}' on this server!`, 404));
  });

  // Define error handlers.
  app.use(errorHandler);

  return app;
}

export default loadExpress;
