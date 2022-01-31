import express from 'express';
import type { RateLimit } from 'express-rate-limit';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import bodyParser from '../middleware/body-parser';
import hasJWT from '../middleware/has-jwt';
import hasSession from '../middleware/has-session';
import AttendanceController from './controller';
import AttendanceValidation from './validation';

/**
 * Handler to take care of 'Attendance' entity.
 *
 * @param limiter - General rate limit.
 * @param strictLimiter - Specific rate limit for sensitive endpoints.
 * @returns Express router.
 */
const AttendanceHandler = (limiter: RateLimit, strictLimiter: RateLimit) => {
  const handler = express.Router({ mergeParams: true });

  // Endpoints are only for authenticated users,
  handler.use(asyncHandler(hasSession));

  // Check out current day status. Almost never blocked by rate limiter.
  handler.get('/status', asyncHandler(AttendanceController.getStatus));

  // Check in for today. Protect with rate limiter.
  handler.post(
    '/in',
    strictLimiter,
    asyncHandler(hasJWT),
    bodyParser,
    validate(AttendanceValidation.in),
    asyncHandler(AttendanceController.in)
  );

  // Check out for today. Protect with rate limiter.
  handler.patch(
    '/out',
    strictLimiter,
    asyncHandler(hasJWT),
    bodyParser,
    validate(AttendanceValidation.out),
    asyncHandler(AttendanceController.out)
  );

  // Gets all attendances data.
  handler.get(
    '/',
    limiter,
    validate(AttendanceValidation.getAttendances),
    asyncHandler(AttendanceController.getAttendances)
  );

  return handler;
};

export default AttendanceHandler;
