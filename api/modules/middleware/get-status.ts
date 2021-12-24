// TODO: 'beautify' code here
import type { Request, Response } from 'express';
import * as jose from 'jose';

import config from '../../config';
import sendResponse from '../../util/send-response';
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
 * Gets the user's status (is normally authenticated and is MFA authenticated).
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 */
const getStatus = async (req: Request, res: Response) => {
  let isAuthenticated = true;
  let isMFA = true;

  try {
    if (!req.session.userID) {
      isAuthenticated = false;
      throw '';
    }

    // extract token and validate
    const token = extractToken(
      req.headers.authorization,
      req.signedCookies['attendance-jws']
    );
    if (!token) {
      isMFA = false;
      throw '';
    }

    // verify token
    let decoded;
    try {
      decoded = await verifyToken(token);
    } catch {
      isMFA = false;
      throw '';
    }

    // verify JTI
    if (!decoded.payload.jti) {
      isMFA = false;
      throw '';
    }

    // check if JTI exists in redis
    const userID = await CacheService.getOTPSession(decoded.payload.jti);
    if (!userID) {
      isMFA = false;
      throw '';
    }

    // check if user still exists in the database
    const user = await UserService.getUserByID(userID);
    if (!user) {
      isMFA = false;
      throw '';
    }
  } catch {
    throw '';
  } finally {
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: {
        isAuthenticated,
        isMFA,
      },
      message: "Successfully fetched the user's status!",
      type: 'users',
    });
  }
};

export default getStatus;
