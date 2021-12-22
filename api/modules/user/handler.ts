import express from 'express';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import UserController from './controller';
import UserValidation from './validation';

/**
 * Handler to take care of 'Users' entity.
 *
 * @returns Express router
 */
const UserHandler = () => {
  const handler = express.Router();

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
