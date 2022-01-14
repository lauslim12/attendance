import express from 'express';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import AttendanceHandler from '../attendance/handler';
import getMe from '../middleware/get-me';
import getStatus from '../middleware/get-status';
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

  // route to attendance based on the current user for better REST-ful
  handler.use('/:id/attendance', AttendanceHandler());

  // status does not need 'asyncHandler' as it is already handled manually in 'middleware/get-status.ts'.
  handler.route('/me/status').get(getStatus);

  // restrict below endpoints for people who have logged in
  handler.use(asyncHandler(hasSession));

  handler
    .route('/me')
    .get(getMe, asyncHandler(UserController.getUser))
    .patch(getMe, asyncHandler(UserController.updateUser));

  // restrict below endpoints for administrators who are logged in and authenticated with MFA
  handler.use(hasRole('admin'), asyncHandler(hasJWT));

  handler
    .route('/')
    .get(asyncHandler(UserController.getUsers))
    .post(
      validate(UserValidation.createUser),
      asyncHandler(UserController.createUser)
    );

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
