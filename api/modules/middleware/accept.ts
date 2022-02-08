import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';

/**
 * Middleware to validate the `Accept` header in the API.
 *
 * @returns Middleware to validate the `Accept` header.
 */
const accept = () => (req: Request, _: Response, next: NextFunction) => {
  const { accept } = req.headers;

  // If the request do not `Accept` available formats, deny the request.
  if (
    !accept?.includes('application/json') &&
    !accept?.includes('application/vnd.nicholasdw.v1+json')
  ) {
    next(new AppError('API does not support the requested content type.', 406));
    return;
  }

  next();
};

export default accept;
