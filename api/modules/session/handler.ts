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
 *
 * @returns Express router.
 */
const SessionHandler = () => {
  const handler = express.Router();

  // Only allow below handlers for authenticated users.
  handler.use(asyncHandler(hasSession));

  // Check personal sessions.
  handler
    .route('/me')
    .get(getMe, asyncHandler(SessionController.getUserSessions));

  // Allow self session invalidation.
  handler
    .route('/me/:id')
    .delete(
      validate(SessionValidation.deleteUserSession),
      asyncHandler(SessionController.deleteMySession)
    );

  // Only allow administrators.
  handler.use(hasRole('admin'));

  // Only allow session checking and session invalidation (admins).
  handler.route('/').get(asyncHandler(SessionController.getAllSessions));

  // Allow session invalidation.
  handler
    .route('/:id')
    .delete(
      validate(SessionValidation.deleteSession),
      asyncHandler(SessionController.deleteSession)
    );

  return handler;
};

export default SessionHandler;
