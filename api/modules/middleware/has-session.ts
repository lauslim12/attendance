import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';

/**
 * Validates whether a user is authenticated or not (via sessions).
 * Checks whether the user's session ID exists in Redis.
 *
 * @param req - Express.js's request object.
 * @param _ - Express.js's response object.
 * @param next - Express.js's next function.
 */
const hasSession = (req: Request, _: Response, next: NextFunction) => {
  if (!req.session.userID) {
    next(new AppError('You are not logged in yet! Please log in first!', 401));
    return;
  }

  next();
};

export default hasSession;
