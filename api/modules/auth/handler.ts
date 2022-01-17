import express from 'express';
import type { RateLimit } from 'express-rate-limit';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import hasSession from '../middleware/has-session';
import AuthController from './controller';
import AuthValidation from './validation';

/**
 * Handler to take care of 'Authentication' entity. All handlers are specific
 * routes, there are no general routes ('/' or '/:id').
 *
 * @param rateLimit - Special rate limiter for authentication purposes.
 * @returns Express router.
 */
const AuthHandler = (rateLimit: RateLimit) => {
  const handler = express.Router();

  // General endpoint, (almost) no rate limit.
  handler.get('/status', AuthController.getStatus);

  // Use specific rate limiter for the remaining of the endpoints.
  handler.use(rateLimit);

  // Logs in a single user.
  handler.post(
    '/login',
    validate(AuthValidation.login),
    asyncHandler(AuthController.login)
  );

  // Logs out a single user.
  handler.post('/logout', AuthController.logout);

  // Sends and verifies OTP.
  handler
    .route('/otp')
    .post(
      asyncHandler(hasSession),
      validate(AuthValidation.sendOTP),
      asyncHandler(AuthController.sendOTP)
    )
    .put(asyncHandler(hasSession), asyncHandler(AuthController.verifyOTP));

  // Registers a single user.
  handler.post(
    '/register',
    validate(AuthValidation.register),
    asyncHandler(AuthController.register)
  );

  // Change password for a logged in user.
  handler.patch(
    '/update-password',
    asyncHandler(hasSession),
    validate(AuthValidation.updatePassword),
    asyncHandler(AuthController.updatePassword)
  );

  return handler;
};

export default AuthHandler;
