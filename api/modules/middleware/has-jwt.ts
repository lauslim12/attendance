import type { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';

import config from '../../config';
import AppError from '../../util/app-error';
import CacheService from '../cache/service';
import UserService from '../user/service';

/**
 * This function is used to verify the current token from user's cookie.
 * We will also check the supposed 'audience' and 'issuer'.
 *
 * @param token - JWT token
 * @returns A promise object that contains our JWT.
 */
const verifyToken = async (token: string) => {
  const publicKey = await jose.importSPKI(config.JWT_PUBLIC_KEY, 'EdDSA');

  const options: jose.JWTVerifyOptions = {
    audience: config.JWT_AUDIENCE,
    issuer: config.JWT_ISSUER,
  };

  return jose.jwtVerify(token, publicKey, options);
};

/**
 * Extracts a token from either Authorization header or signed cookie.
 * Prioritize token from Authorization header.
 *
 * @param header - Authorization header value
 * @param signedCookie - Signed cookie if applicable
 * @returns Extracted JWT token
 */
const extractToken = (
  header: string | undefined,
  signedCookie: string | undefined
) => {
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  return signedCookie;
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
  // extract token and validate
  const token = extractToken(
    req.headers.authorization,
    req.signedCookies['attendance-jws']
  );
  if (!token) {
    res.set('WWW-Authenticate', 'Bearer realm="OTP"');
    next(
      new AppError(
        'You do not possess an OTP session. Please verify your OTP by MFA.',
        401
      )
    );
    return;
  }

  // verify token
  const decoded = await verifyToken(token);

  // verify JTI
  if (!decoded.payload.jti) {
    res.set('WWW-Authenticate', 'Bearer realm="OTP"');
    next(
      new AppError(
        'The JTI of the token is wrong or does not exist. Please verify OTP again.',
        401
      )
    );
    return;
  }

  // check if JTI exists in redis
  const userID = await CacheService.getOTPSession(decoded.payload.jti);
  if (!userID) {
    res.set('WWW-Authenticate', 'Bearer realm="OTP"');
    next(new AppError('This token does not exist in the database.', 401));
    return;
  }

  // check if user still exists in the database
  const user = await UserService.getUserByID(userID);
  if (!user) {
    res.set('WWW-Authenticate', 'Bearer realm="OTP"');
    next(new AppError('User belonging to this token does not exist.', 401));
    return;
  }

  // grant user access to an endpoint, go to next middleware
  req.userID = userID;
  next();
};

export default hasJWT;
