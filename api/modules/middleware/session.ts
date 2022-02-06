import connectRedis from 'connect-redis';
import type { NextFunction, Request, Response } from 'express';
import type { CookieOptions } from 'express-session';
import expressSession from 'express-session';

import config from '../../config';
import redis from '../../infra/redis';
import isHTTPS from '../../util/is-https';

/**
 * Initializes a session middleware for use.
 *
 * @returns An initialized Express Sessions middleware.
 */
const session = () => (req: Request, res: Response, next: NextFunction) => {
  const RedisSessionStore = connectRedis(expressSession);

  const options: CookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 7200 * 1000, // 2 hours that will be refreshed every time the user hits a 'has-session' middleware.
    secure: isHTTPS(req), // Use 'secure' on production environment.
    path: '/', // Send in every requests.
  };

  // Use '__Host-' prefix on cookie name in production.
  const cookie = isHTTPS(req)
    ? `__Host-${config.SESSION_COOKIE}`
    : config.SESSION_COOKIE;

  return expressSession({
    store: new RedisSessionStore({ client: redis.nodeRedis }),
    name: cookie,
    saveUninitialized: false,
    resave: false,
    secret: config.COOKIE_SECRET,
    cookie: options,
  })(req, res, next);
};

export default session;
