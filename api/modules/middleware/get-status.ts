// TODO: 'beautify' and make code more structured here
import type { Request, Response } from 'express';

import { extractToken, verifyToken } from '../../util/header-and-jwt';
import sendResponse from '../../util/send-response';
import CacheService from '../cache/service';
import UserService from '../user/service';

/**
 * Gets the user's status (is normally authenticated and is MFA authenticated).
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 */
const getStatus = async (req: Request, res: Response) => {
  // Initial state of a current user.
  const status = {
    isAuthenticated: false,
    isMFA: false,
  };

  try {
    if (!req.session.userID) {
      throw '';
    }

    // flag is authenticated
    status.isAuthenticated = true;

    // extract token and validate
    const token = extractToken(
      req.headers.authorization,
      req.signedCookies['attendance-jws']
    );
    if (!token) {
      throw '';
    }

    // verify token
    let decoded;
    try {
      decoded = await verifyToken(token);
    } catch {
      throw '';
    }

    // verify JTI
    if (!decoded.payload.jti) {
      throw '';
    }

    // check if JTI exists in redis
    const userID = await CacheService.getOTPSession(decoded.payload.jti);
    if (!userID) {
      throw '';
    }

    // check if user still exists in the database
    const user = await UserService.getUserByID(userID);
    if (!user) {
      throw '';
    }

    // flag is MFA
    status.isMFA = true;

    // send response here as well
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: {
        isAuthenticated: status.isAuthenticated,
        isMFA: status.isMFA,
      },
      message: "Successfully fetched the user's status!",
      type: 'users',
    });
  } catch {
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: {
        isAuthenticated: status.isAuthenticated,
        isMFA: status.isMFA,
      },
      message: "Successfully fetched the user's status!",
      type: 'users',
    });
  }
};

export default getStatus;
