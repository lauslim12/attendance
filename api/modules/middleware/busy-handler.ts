import type { NextFunction, Request, Response } from 'express';
import toobusy from 'toobusy-js';

import AppError from '../../util/app-error';

/**
 * Checks whether the server is too busy or not. If the server is busy
 * handling a lot of requests, send back `503 Service Unavailable`.
 *
 * @returns Middleware function to check if the server is too busy.
 */
const busyHandler = () => (_: Request, __: Response, next: NextFunction) => {
  if (toobusy()) {
    next(
      new AppError('API is currently too busy. Please try again later!', 503)
    );
    return;
  }

  next();
};

export default busyHandler;
