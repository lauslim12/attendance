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

  handler.get('/status', AuthController.getStatus);

  // Use specific rate limiter for the remaining of the endpoints.
  handler.use(rateLimit);

  handler.post(
    '/login',
    validate(AuthValidation.login),
    asyncHandler(AuthController.login)
  );

  handler.post('/logout', AuthController.logout);

  handler
    .route('/otp')
    .post(
      asyncHandler(hasSession),
      validate(AuthValidation.sendOTP),
      asyncHandler(AuthController.sendOTP)
    )
    .put(asyncHandler(hasSession), asyncHandler(AuthController.verifyOTP));

  handler.post(
    '/register',
    validate(AuthValidation.register),
    asyncHandler(AuthController.register)
  );

  return handler;
};

export default AuthHandler;
