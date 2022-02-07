import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';

/**
 * If consumer does not pass the `X-Requested-With` header, then
 * we can assume that the request is forged with CSRF. `X-Requested-With`
 * will force requests to enter preflight state first before accessing the API. As
 * long as the CORS policy is strong, CSRF should be mitigated completely.
 *
 * References:
 * {@link https://stackoverflow.com/questions/17478731/whats-the-point-of-the-x-requested-with-header}
 * {@link https://markitzeroday.com/x-requested-with/cors/2017/06/29/csrf-mitigation-for-ajax-requests.html}
 * {@link https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#use-of-custom-request-headers}
 *
 * @returns Middleware function to check for `X-Requested-With` header.
 */
const xRequestedWith =
  () => (req: Request, _: Response, next: NextFunction) => {
    if (!req.headers['x-requested-with']) {
      next(
        new AppError(
          'Access denied as the request is possibly tampered with a possible attempt to perform CSRF in the API.',
          403
        )
      );
      return;
    }

    next();
  };

export default xRequestedWith;
