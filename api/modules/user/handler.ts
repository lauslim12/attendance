import express from 'express';
import type { RateLimit } from 'express-rate-limit';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import AttendanceHandler from '../attendance/handler';
import bodyParser from '../middleware/body-parser';
import getMe from '../middleware/get-me';
import hasJWT from '../middleware/has-jwt';
import hasRole from '../middleware/has-role';
import hasSession from '../middleware/has-session';
import UserController from './controller';
import UserValidation from './validation';

/**
 * Handler to take care of 'Users' entity.
 *
 * @param limiter - General rate limit.
 * @param strictLimiter - Specific rate limit for sensitive endpoints.
 * @returns Express router.
 */
const UserHandler = (limiter: RateLimit, strictLimiter: RateLimit) => {
  const handler = express.Router();

  // Route to 'Attendance' entity based on the current user for better REST-ful experience.
  handler.use('/:id/attendance', AttendanceHandler(limiter, strictLimiter));

  // Below endpoints are allowed for only authenticated users, and place rate limiter.
  handler.use(limiter, asyncHandler(hasSession));

  // Allow user to get their own data and update their own data as well.
  handler
    .route('/me')
    .get(getMe, asyncHandler(UserController.getUser))
    .patch(
      getMe,
      bodyParser,
      validate(UserValidation.updateMe),
      asyncHandler(UserController.updateUser)
    )
    .delete(getMe, asyncHandler(UserController.deactivateUser));

  // Restrict endpoints for admins who are logged in and authenticated with MFA.
  handler.use(hasRole('admin'), asyncHandler(hasJWT));

  // Perform get and create operations on the general entity.
  handler
    .route('/')
    .get(asyncHandler(UserController.getUsers))
    .post(
      bodyParser,
      validate(UserValidation.createUser),
      asyncHandler(UserController.createUser)
    );

  // Perform get, update, and delete operations on a specific entity.
  handler
    .route('/:id')
    .get(validate(UserValidation.getUser), asyncHandler(UserController.getUser))
    .patch(
      bodyParser,
      validate(UserValidation.updateUser),
      asyncHandler(UserController.updateUser)
    )
    .delete(
      validate(UserValidation.deleteUser),
      asyncHandler(UserController.deleteUser)
    );

  return handler;
};

export default UserHandler;
