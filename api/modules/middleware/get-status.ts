import type { Request, Response } from 'express';

import { extractToken, verifyToken } from '../../util/header-and-jwt';
import sendResponse from '../../util/send-response';
import CacheService from '../cache/service';
import UserService from '../user/service';

/**
 * Sends the user's authentication status to the client in the form of JSON response.
 * The 'type' of the response is authentication, as this one does not really
 * fit with the 'users' type.
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 * @param isAuthenticated - Boolean value whether the user is authenticated or not.
 * @param isMFA - Boolean value whether the user is on secure session or not.
 */
const sendUserStatus = (
  req: Request,
  res: Response,
  isAuthenticated: boolean,
  isMFA: boolean
) => {
  sendResponse({
    req,
    res,
    status: 'success',
    statusCode: 200,
    data: { isAuthenticated, isMFA },
    message: "Successfully fetched the user's status!",
    type: 'auth',
  });
};

/**
 * Gets the user's status (is normally authenticated and is MFA authenticated). The authentication
 * process is similar to the ones in 'has-session.ts' and 'has-jwt.ts'.
 * This is a special middleware. It should have no 'next', and this middleware
 * will ignore ANY errors that might be in the way. If an error is found, the user
 * will not be authenticated and will not throw an 'AppError'.
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 */
const getStatus = async (req: Request, res: Response) => {
  try {
    // Check session.
    if (!req.session.userID) {
      sendUserStatus(req, res, false, false);
      return;
    }

    // Extract token and validate.
    const token = extractToken(
      req.headers.authorization,
      req.signedCookies['attendance-jws']
    );
    if (!token) {
      sendUserStatus(req, res, true, false);
      return;
    }

    // Verify token.
    const decoded = await verifyToken(token);

    // Verify JTI.
    if (!decoded.payload.jti) {
      sendUserStatus(req, res, true, false);
      return;
    }

    // Checks whether JTI exists or not in the cache.
    const userID = await CacheService.getOTPSession(decoded.payload.jti);
    if (!userID) {
      sendUserStatus(req, res, true, false);
      return;
    }

    // Check if user exists in the database.
    const user = await UserService.getUser({ userID });
    if (!user) {
      sendUserStatus(req, res, true, false);
      return;
    }

    // Send final response that the user is properly authenticated and authorized.
    sendUserStatus(req, res, true, true);
  } catch {
    sendUserStatus(req, res, false, false);
  }
};

export default getStatus;
