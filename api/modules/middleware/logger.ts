import type { LoggerOptions } from 'express-winston';
import expressWinston from 'express-winston';
import path from 'path';
import winston from 'winston';

import getDeviceID from '../../util/device-id';

/**
 * Options for the default loggers.
 */
const options: LoggerOptions = {
  // Store all logs in files. Will be created automatically as long as it does not break any permissions.
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'attendance.log'),
    }),
  ],

  // Prints all logs with timestamps in JSON format.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  // Print request metadata.
  meta: true,

  // Inject additional object: True IP and device if applicable.
  dynamicMeta: (req) => ({ deviceInfo: getDeviceID(req) }),

  // Customized message attribute in logging.
  msg: 'HTTP {{req.method}} {{req.url}}',

  // Deactivate both colorization and Express Format, we have our own format.
  expressFormat: false,
  colorize: false,

  // Do not allow cookie and authorization in our loggers. It may have session ID or MFA token.
  headerBlacklist: ['authorization', 'cookie'],

  // Ignore frequently called routes via SWR.
  ignoredRoutes: ['/api/v1/auth/status', '/api/v1/attendance/status'],

  // Log everything.
  requestWhitelist: [
    'url',
    'headers',
    'method',
    'httpVersion',
    'originalUrl',
    'query',
    'body',
  ],

  // Do not log passwords.
  bodyBlacklist: ['password'],
};

/**
 * Success loggers.
 */
export const successLogger = expressWinston.logger(options);

/**
 * Failure loggers.
 */
export const errorLogger = expressWinston.errorLogger(options);
