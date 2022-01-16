import express from 'express';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import AttendanceHandler from '../attendance/handler';
import getMe from '../middleware/get-me';
import hasJWT from '../middleware/has-jwt';
import hasRole from '../middleware/has-role';
import hasSession from '../middleware/has-session';
import UserController from './controller';
import UserValidation from './validation';

/**
 * Handler to take care of 'Users' entity.
 *
 * @returns Express router
 */
const UserHandler = () => {
  const handler = express.Router();

  // Route to 'Attendance' entity based on the current user for better REST-ful experience.
  handler.use('/:id/attendance', AttendanceHandler());

  // Below endpoints are allowed for only authenticated users.
  handler.use(asyncHandler(hasSession));

  // Allow user to get their own data and update their own data as well.
  handler
    .route('/me')
    .get(getMe, asyncHandler(UserController.getUser))
    .patch(getMe, asyncHandler(UserController.updateUser));

  // Restrict endpoints for admins who are logged in and authenticated with MFA.
  handler.use(hasRole('admin'), asyncHandler(hasJWT));

  // Perform get and create operations on the general entity.
  handler
    .route('/')
    .get(asyncHandler(UserController.getUsers))
    .post(
      validate(UserValidation.createUser),
      asyncHandler(UserController.createUser)
    );

  // Perform get, update, and delete operations on a specific entity.
  handler
    .route('/:id')
    .get(validate(UserValidation.getUser), asyncHandler(UserController.getUser))
    .patch(
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
