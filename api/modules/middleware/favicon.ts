import type { NextFunction, Request, Response } from 'express';

/**
 * Prevents `404 Not Found` when searching for the `favicon.ico` file in the API.
 *
 * @returns A middleware to be used globally.
 */
const favicon = () => (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end();
    return;
  }

  next();
};

export default favicon;
