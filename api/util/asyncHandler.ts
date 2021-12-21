import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * This is a helper function in order to handle errors in an asynchronous function.
 * You only need to wrap this one, and then you will be able to handle its errors automatically.
 *
 * @param fn - A generic, asynchronous function handler from Express.js
 * @returns A promise object that will throw any errors to our global error handler / next middleware stack
 */
const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
