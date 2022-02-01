import type { Request } from 'express';

/**
 * Verifies whether the current connection is secure (HTTPS) or not.
 *
 * @param req - Express.js's request object.
 * @returns A boolean value whether the connection is secure or not.
 */
const isHTTPS = (req: Request) => {
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return true;
  }

  return false;
};

export default isHTTPS;
