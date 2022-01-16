import express from 'express';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import hasJWT from '../middleware/has-jwt';
import hasSession from '../middleware/has-session';
import AttendanceController from './controller';
import AttendanceValidation from './validation';

/**
 * Handler to take care of 'Attendance' entity.
 *
 * @returns Express router.
 */
const AttendanceHandler = () => {
  const handler = express.Router({ mergeParams: true });

  // Endpoints are only for authenticated users.
  handler.use(asyncHandler(hasSession));

  // Check in for today.
  handler.post(
    '/in',
    asyncHandler(hasJWT),
    validate(AttendanceValidation.in),
    asyncHandler(AttendanceController.in)
  );

  // Check out for today.
  handler.patch(
    '/out',
    asyncHandler(hasJWT),
    validate(AttendanceValidation.out),
    asyncHandler(AttendanceController.out)
  );

  // Gets all attendances data.
  handler.get(
    '/',
    validate(AttendanceValidation.getAttendances),
    asyncHandler(AttendanceController.getAttendances)
  );

  return handler;
};

export default AttendanceHandler;
