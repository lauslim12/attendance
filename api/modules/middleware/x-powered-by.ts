import { NextFunction, Request, Response } from 'express';

/**
 * Override `X-Powered-By` with some other string.
 *
 * @returns Middleware function to override `X-Powered-By`.
 */
const xPoweredBy = () => (_: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'Nicholas');
  next();
};

export default xPoweredBy;
