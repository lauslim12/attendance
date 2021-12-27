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
 * @returns Express router
 */
const AttendanceHandler = () => {
  const handler = express.Router({ mergeParams: true });

  handler.post(
    '/in',
    asyncHandler(hasSession),
    asyncHandler(hasJWT),
    validate(AttendanceValidation.in),
    asyncHandler(AttendanceController.in)
  );

  handler.patch(
    '/out',
    asyncHandler(hasSession),
    asyncHandler(hasJWT),
    validate(AttendanceValidation.out),
    asyncHandler(AttendanceController.out)
  );

  handler.get(
    '/',
    asyncHandler(hasSession),
    validate(AttendanceValidation.getAttendances),
    asyncHandler(AttendanceController.getAttendances)
  );

  return handler;
};

export default AttendanceHandler;
