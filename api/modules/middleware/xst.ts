import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';

/**
 * Prevent Cross-Site Tracing by only allowing the following methods:
 * [OPTIONS, HEAD, CONNECT, GET, POST, PATCH, PUT, DELETE].
 *
 * @returns A closure function to perform the middleware.
 */
const xst = () => (req: Request, _: Response, next: NextFunction) => {
  const allowedMethods = [
    'OPTIONS',
    'HEAD',
    'CONNECT',
    'GET',
    'POST',
    'PATCH',
    'PUT',
    'DELETE',
  ];

  if (!allowedMethods.includes(req.method)) {
    next(new AppError(`Method ${req.method} is not allowed in this API!`, 405));
    return;
  }

  next();
};

export default xst;
