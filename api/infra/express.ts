import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import config from '../config';
import AttendanceHandler from '../modules/attendance/handler';
import AuthHandler from '../modules/auth/handler';
import errorHandler from '../modules/error';
import HealthHandler from '../modules/health/handler';
import busyHandler from '../modules/middleware/busy-handler';
import favicon from '../modules/middleware/favicon';
import { errorLogger, successLogger } from '../modules/middleware/logger';
import notFound from '../modules/middleware/not-found';
import session from '../modules/middleware/session';
import slowDown from '../modules/middleware/slow-down';
import xPoweredBy from '../modules/middleware/x-powered-by';
import xRequestedWith from '../modules/middleware/x-requested-with';
import xst from '../modules/middleware/xst';
import SessionHandler from '../modules/session/handler';
import UserHandler from '../modules/user/handler';

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

  // Check for CSRF via the Header method.
  app.use(xRequestedWith());

  // Security headers.
  app.use(
    helmet({
      frameguard: {
        action: 'deny',
      },
      hidePoweredBy: false,
    })
  );

  // Handle if server is too busy.
  app.use(busyHandler());

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
  app.use(xst());

  // Send 204 on icon requests.
  app.use(favicon());

  // Prepare to use Express Sessions.
  app.use(session());

  // Enable special `X-Powered-By` header.
  app.use(xPoweredBy());

  // Define handlers.
  const attendanceHandler = AttendanceHandler();
  const authHandler = AuthHandler();
  const healthHandler = HealthHandler();
  const sessionHandler = SessionHandler();
  const userHandler = UserHandler();

  // Log requests (successful requests).
  app.use(successLogger);

  // Define API routes. Throttle '/api' route to prevent spammers.
  app.use('/api', slowDown(75));
  app.use('/api/v1', healthHandler);
  app.use('/api/v1/attendance', attendanceHandler);
  app.use('/api/v1/auth', authHandler);
  app.use('/api/v1/sessions', sessionHandler);
  app.use('/api/v1/users', userHandler);

  // Catch-all routes for API.
  app.all('*', notFound());

  // Log errors.
  app.use(errorLogger);

  // Define error handlers.
  app.use(errorHandler);

  // Return configured app.
  return app;
}

export default loadExpress;
