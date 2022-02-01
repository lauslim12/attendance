import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import { extractJWT, verifyToken } from '../../util/header-and-jwt';
import CacheService from '../cache/service';

/**
 * Validates whether a user is authorized/authenticated or not (via JWT).
 * Checks whether the user's session ID exists in Redis.
 *
 * @param req - Express.js's request object.
 * @param _ - Express.js's response object.
 * @param next - Express.js's next function.
 */
const hasJWT = async (req: Request, _: Response, next: NextFunction) => {
  // Extract token and validate.
  const token = extractJWT(req);
  if (!token) {
    next(
      new AppError(
        'You do not possess an OTP session. Please verify your OTP by MFA.',
        401
      )
    );
    return;
  }

  // Verify the token.
  const decoded = await verifyToken(token);

  // Verify the token's JTI.
  if (!decoded.payload.jti) {
    next(
      new AppError(
        'The JTI of the token is invalid. Please verify your session again.',
        401
      )
    );
    return;
  }

  // Check if JTI exists in Redis.
  const userID = await CacheService.getOTPSession(decoded.payload.jti);
  if (!userID) {
    next(new AppError('This token does not exist in the database.', 401));
    return;
  }

  // Validate whether the session is equal to the user ID + the sub property,
  // there is no need to call the database here (reduces overhead).
  if (req.session.userID !== userID || decoded.payload.sub !== userID) {
    next(new AppError('User belonging to this token does not exist.', 404));
    return;
  }

  // Grant user access to an endpoint, go to next middleware.
  next();
};

export default hasJWT;
