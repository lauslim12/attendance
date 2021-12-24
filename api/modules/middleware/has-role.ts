import { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';

/**
 * Checks whether a user does have sufficient privileges / roles to access this endpoint.
 *
 * @param roles - Roles that are allowed to access this endpoint.
 */
const hasRole =
  (...roles: string[]) =>
  (req: Request, _: Response, next: NextFunction) => {
    if (!req.session.userID || !req.session.userRole) {
      next(new AppError('Session not found. Please log in again!', 401));
      return;
    }

    if (!roles.includes(req.session.userRole)) {
      next(
        new AppError('You are not authorized to access this endpoint!', 403)
      );
      return;
    }

    next();
  };

export default hasRole;
