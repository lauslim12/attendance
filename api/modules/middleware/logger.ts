import type { LoggerOptions } from 'express-winston';
import expressWinston from 'express-winston';
import path from 'path';
import winston from 'winston';

/**
 * Options for the default loggers.
 */
const options: LoggerOptions = {
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'attendance.log'), // Will be created automatically as long as it does not break any permissions.
    }),
  ],
  format: winston.format.json(),
  meta: true,
  msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
  expressFormat: false,
  colorize: false,
  ignoredRoutes: ['/api/v1/auth/status', '/api/v1/attendance/status'],
};

/**
 * Success loggers.
 */
export const successLogger = expressWinston.logger(options);

/**
 * Failure loggers.
 */
export const errorLogger = expressWinston.errorLogger(options);
