import type { Request, Response } from 'express';

import isHTTPS from './is-https';

/**
 * Object parameters for our `setCookie` function.
 */
type Params = {
  req: Request;
  res: Response;
  name: string;
  value: string;
  maxAge: number;
};

/**
 * Sets a cookie according to the best practices by OWASP.
 *
 * {@link https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes}
 *
 * @param params - Object parameters.
 */
const setCookie = ({ req, res, name, value, maxAge }: Params) => {
  // Use '__Host-' prefix for security in HTTPS.
  const cookie = isHTTPS(req) ? `__Host-${name}` : name;

  res.cookie(cookie, value, {
    httpOnly: true,
    secure: isHTTPS(req),
    sameSite: 'strict',
    maxAge,
    signed: true,
    path: '/',
  });
};

export default setCookie;
