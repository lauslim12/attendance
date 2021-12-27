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
  const handler = express.Router();

  handler.post(
    '/in',
    asyncHandler(hasSession),
    asyncHandler(hasJWT),
    validate(AttendanceValidation.in),
    asyncHandler(AttendanceController.in)
  );

  handler.post('/out');

  return handler;
};

export default AttendanceHandler;
