import type { NextFunction, Request, Response } from 'express';
import { json as parse } from 'express';

import AppError from '../../util/app-error';

/**
 * Parses the request body of a request. Do not use this middleware globally. Instead,
 * use this in requests where you need to parse the request body. This makes the whole API
 * slightly faster, and saves bandwith / computing powers as well.
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 * @param next - Express.js's next function.
 * @returns Customized instance of `express.json`, complete with preprocessing.
 */
const bodyParser = (req: Request, res: Response, next: NextFunction) => {
  const { ['content-type']: type, ['content-length']: length } = req.headers;

  // Ensures 'Content-Type' is 'application/json'.
  if (!type?.includes('application/json')) {
    next(
      new AppError(
        "This API only accepts 'Content-Type' of 'application/json!'",
        415
      )
    );
    return;
  }

  // Quick checking: if 'Content-Length' is bigger than the specified bytes,
  // we will short circuit right away. If the 'Content-Length' is spoofed and the payload
  // is greater than anticipated, the next `parse` function will take care of it accordingly.
  if (length && Number.parseInt(length, 10) > 512) {
    next(
      new AppError('Request is too large! Please reduce your payload!', 413)
    );
    return;
  }

  // We have to `return` this specific middleware as this is an Express middleware, so it can go
  // straight to the next stack. Simply calling the `parse` function will not suffice.
  return parse({ type: 'application/json', limit: 512 })(req, res, next);
};

export default bodyParser;
