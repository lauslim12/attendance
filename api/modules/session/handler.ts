import express from 'express';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import getMe from '../middleware/get-me';
import hasRole from '../middleware/has-role';
import hasSession from '../middleware/has-session';
import SessionController from './controller';
import SessionValidation from './validation';

/**
 * Handle all session-related endpoints.
 */
const SessionHandler = () => {
  const handler = express.Router();

  // only allow logged in users
  handler.use(asyncHandler(hasSession));

  // check my sessions
  handler
    .route('/me')
    .get(getMe, asyncHandler(SessionController.getUserSessions));

  // allow self session invalidation
  handler
    .route('/me/:id')
    .delete(
      validate(SessionValidation.deleteUserSession),
      asyncHandler(SessionController.deleteMySession)
    );

  // only allow administrators
  handler.use(hasRole('admin'));

  // only allow session checking and session invalidation
  handler.route('/').get(asyncHandler(SessionController.getAllSessions));

  handler
    .route('/:id')
    .delete(
      validate(SessionValidation.deleteSession),
      asyncHandler(SessionController.deleteSession)
    );

  return handler;
};

export default SessionHandler;
