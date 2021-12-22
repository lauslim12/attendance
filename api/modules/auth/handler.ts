import express from 'express';
import { validate } from 'express-validation';

import asyncHandler from '../../util/async-handler';
import hasSession from '../middleware/has-session';
import AuthController from './controller';
import AuthValidation from './validation';

/**
 * Handler to take care of 'Authentication' entity.
 *
 * @returns Express router
 */
const AuthHandler = () => {
  const handler = express.Router();

  handler.post(
    '/login',
    validate(AuthValidation.login),
    asyncHandler(AuthController.login)
  );

  handler.post('/logout', asyncHandler(AuthController.logout));

  handler.put('/otp', hasSession, asyncHandler(AuthController.verifyOTP));

  handler.post('/register');

  handler.post(
    '/otp/:media',
    hasSession,
    validate(AuthValidation.sendOTP),
    asyncHandler(AuthController.sendOTP)
  );

  return handler;
};

export default AuthHandler;