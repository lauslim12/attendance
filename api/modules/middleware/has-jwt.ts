import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import { extractToken, verifyToken } from '../../util/header-and-jwt';
import CacheService from '../cache/service';
import UserService from '../user/service';

/**
 * Sets the 'WWW-Authenticate' header properly with the right 'Realm'.
 *
 * @param msg - Error message to be passed to the user.
 * @param res - Express.js's response object.
 * @param next - Express.js's next function.
 */
const invalidBearerAuth = (msg: string, res: Response, next: NextFunction) => {
  res.set('WWW-Authenticate', 'Bearer realm="OTP-JWS"');
  next(new AppError(msg, 401));
};

/**
 * Validates whether a user is authorized/authenticated or not (via JWT).
 * Checks whether the user's session ID exists in Redis.
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 * @param next - Express.js's next function.
 */
const hasJWT = async (req: Request, res: Response, next: NextFunction) => {
  // Extract token and validate.
  const token = extractToken(
    req.headers.authorization,
    req.signedCookies['attendance-jws']
  );
  if (!token) {
    invalidBearerAuth(
      'You do not possess an OTP session. Please verify your OTP by MFA.',
      res,
      next
    );
    return;
  }

  // Verify the token.
  const decoded = await verifyToken(token);

  // Verify the token's JTI.
  if (!decoded.payload.jti) {
    invalidBearerAuth(
      'The JTI of the token is wrong or does not exist. Please verify your session again.',
      res,
      next
    );
    return;
  }

  // Check if JTI exists in Redis.
  const userID = await CacheService.getOTPSession(decoded.payload.jti);
  if (!userID) {
    invalidBearerAuth('This token does not exist in the database.', res, next);
    return;
  }

  // Check if the user still exists in the database.
  const user = await UserService.getUser({ userID });
  if (!user) {
    invalidBearerAuth(
      'User belonging to this token does not exist.',
      res,
      next
    );
    return;
  }

  // Grant user access to an endpoint, go to next middleware.
  req.userID = userID;
  next();
};

export default hasJWT;
