import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import UserService from '../user/service';

/**
 * Validates whether a user is authenticated or not (via sessions).
 * Also performs a check as to whether the user's session ID exists in Redis.
 *
 * @param req - Express.js's request object.
 * @param _ - Express.js's response object.
 * @param next - Express.js's next function.
 */
const hasSession = async (req: Request, _: Response, next: NextFunction) => {
  const { userID } = req.session;

  if (!userID) {
    next(new AppError('You are not logged in yet! Please log in first!', 401));
    return;
  }

  // Check in an unlikely scenario: a user has already deleted his account but their session is still active.
  const user = await UserService.getUser({ userID });
  if (!user) {
    next(new AppError('User belonging to this session does not exist.', 400));
    return;
  }

  next();
};

export default hasSession;
