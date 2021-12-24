import { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';

/**
 * Moves a user's ID to the 'params' object.
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 * @param next - Express.js's next function.
 */
const getMe = (req: Request, _: Response, next: NextFunction) => {
  if (!req.session.userID) {
    next(new AppError('No session detected. Please log in again!', 401));
    return;
  }

  req.params.id = req.session.userID;
  next();
};

export default getMe;
