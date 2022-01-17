import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import sendResponse from '../../util/send-response';
import CacheService from '../cache/service';

/**
 * Handle all requests from 'SessionHandler'.
 */
const SessionController = {
  /**
   * Deletes a single session specific for a single user. A user has to 'own' this session
   * before they can proceed with the deletion.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  deleteMySession: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { userID } = req.session;

    if (!userID) {
      next(new AppError('No session detected. Please log in again.', 401));
      return;
    }

    // Validates whether the session belongs to the user or not.
    const currentSessions = await CacheService.getUserSessions(userID);
    const mySess = currentSessions.some((sess) => sess.sid === id);
    if (!mySess) {
      next(new AppError('You do not have a session with that ID.', 404));
      return;
    }

    // Delete individual session if it is not the current session.
    if (req.sessionID !== id) {
      await CacheService.deleteSession(id);
      res.status(204).send();
      return;
    }

    // If the session in question is the current session, delete it by destroying it.
    req.session.destroy((err) => {
      if (err) {
        next(new AppError('Failed to log out. Please try again.', 500));
        return;
      }

      res.status(204).send();
    });
  },

  /**
   * Deletes a single session without any validations whatsoever. Intentionally
   * made like this to prevent bad UX (sessions are highly flexible and we can accidentally
   * delete an invalid session). Either way, all sessions are also handled by `express-session`, so
   * there's actually no way for this to 'mess up'.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  deleteSession: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Delete individual session if it is not the current session.
    if (req.sessionID !== id) {
      await CacheService.deleteSession(id);
      res.status(204).send();
      return;
    }

    // If the session in question is the current session, destroy it.
    req.session.destroy((err) => {
      if (err) {
        next(new AppError('Failed to log out. Please try again.', 500));
        return;
      }

      res.status(204).send();
    });
  },

  /**
   * Gets all sessions in the cache.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   */
  getAllSessions: async (req: Request, res: Response) => {
    const sessions = await CacheService.getSessions();

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: sessions,
      message: 'Successfully fetched all sessions!',
      type: 'sessions',
    });
  },

  /**
   * Gets all sessions related to a single user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   */
  getUserSessions: async (req: Request, res: Response) => {
    const { id } = req.params;

    const sessions = await CacheService.getUserSessions(id);

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: sessions,
      message: 'Successfully fetched all sessions of this user!',
      type: 'sessions',
    });
  },
};

export default SessionController;
