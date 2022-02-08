import { Router } from 'express';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import bodyParser from '../middleware/body-parser';
import hasJWT from '../middleware/has-jwt';
import hasSession from '../middleware/has-session';
import rateLimit from '../middleware/rate-limit';
import AuthController from './controller';
import AuthValidation from './validation';

/**
 * Handler to take care of 'Authentication' entity. All handlers are specific
 * routes, there are no general routes ('/' or '/:id').
 *
 * @returns Express router.
 */
const AuthHandler = () => {
  const handler = Router();
  const authRateLimit = rateLimit(10, 'auth');

  // General endpoint, (almost) no rate limit.
  handler.get('/status', AuthController.getStatus);

  // Logs in a single user.
  handler.post(
    '/login',
    authRateLimit,
    bodyParser,
    validate(AuthValidation.login),
    asyncHandler(AuthController.login)
  );

  // Logs out a single user.
  handler.post('/logout', AuthController.logout);

  // Sends and verifies OTP.
  handler
    .route('/otp')
    .post(
      authRateLimit,
      asyncHandler(hasSession),
      validate(AuthValidation.sendOTP),
      asyncHandler(AuthController.sendOTP)
    )
    .put(
      authRateLimit,
      asyncHandler(hasSession),
      asyncHandler(AuthController.verifyOTP)
    );

  // Registers a single user.
  handler.post(
    '/register',
    rateLimit(3, 'auth-register', 30),
    bodyParser,
    validate(AuthValidation.register),
    asyncHandler(AuthController.register)
  );

  // Updates MFA for the currently logged in user.
  handler.patch(
    '/update-mfa',
    authRateLimit,
    asyncHandler(hasSession),
    asyncHandler(hasJWT),
    asyncHandler(AuthController.updateMFA)
  );

  // Change password for a logged in user.
  handler.patch(
    '/update-password',
    authRateLimit,
    asyncHandler(hasSession),
    bodyParser,
    validate(AuthValidation.updatePassword),
    asyncHandler(AuthController.updatePassword)
  );

  // Verifies an email.
  handler.patch(
    '/verify-email/:code/:email',
    authRateLimit,
    validate(AuthValidation.verifyEmail),
    asyncHandler(AuthController.verifyEmail)
  );

  return handler;
};

export default AuthHandler;
