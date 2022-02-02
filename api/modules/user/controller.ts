import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import sendResponse from '../../util/send-response';
import CacheService from '../cache/service';
import UserService from './service';

/**
 * Create controller to handle all requests forwarded from 'UserHandler'.
 */
const UserController = {
  /**
   * Creates a single user. Has several validations to ensure that the username,
   * email, and phone number are all unique and have not yet been used by another user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, phoneNumber, password, fullName } = req.body;

    // Validates whether the username or email or phone is already used or not. Use
    // parallel processing for speed.
    const [userByUsername, userByEmail, userByPhone] = await Promise.all([
      UserService.getUser({ username }),
      UserService.getUser({ email }),
      UserService.getUser({ phoneNumber }),
    ]);

    // Perform checks and validations.
    if (userByUsername) {
      next(new AppError('This username has existed already!', 422));
      return;
    }

    if (userByEmail) {
      next(new AppError('This email has been used by another user!', 422));
      return;
    }

    if (userByPhone) {
      next(
        new AppError('This phone number has been used by another user!', 422)
      );
      return;
    }

    const user = await UserService.createUser({
      username,
      email,
      phoneNumber,
      password,
      totpSecret: '', // kept blank to ensure that this gets filled in the service layer
      fullName,
    });

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 201,
      data: user,
      message: 'Successfully created a single user!',
      type: 'users',
    });
  },

  /**
   * Deactivates / ban a single user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  deactivateUser: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!(await UserService.getUser({ userID: id }))) {
      next(new AppError('The user with this ID does not exist!', 404));
      return;
    }

    await UserService.updateUser({ userID: id }, { isActive: false });

    // Delete all of their sessions.
    req.session.destroy(async (err) => {
      if (err) {
        next(new AppError('Failed to log out. Please try again.', 500));
        return;
      }

      await CacheService.deleteUserSessions(id);
      res.status(204).send();
    });
  },

  /**
   * Deletes a single user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!(await UserService.getUser({ userID: id }))) {
      next(new AppError('The user with this ID does not exist!', 404));
      return;
    }

    await UserService.deleteUser({ userID: id });

    // Delete all of their sessions.
    if (req.session.userID !== id) {
      await CacheService.deleteUserSessions(id);
      res.status(204).send();
      return;
    }

    // This shouldn't happen, but let's say if an admin deletes themself...
    req.session.destroy(async (err) => {
      if (err) {
        next(new AppError('Internal server error. Please try again.', 500));
        return;
      }

      await CacheService.deleteUserSessions(id);
      res.status(204).send();
    });
  },

  /**
   * Gets a single user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   */
  getUser: async (req: Request, res: Response) => {
    const user = await UserService.getUser({ userID: req.params.id });

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: user,
      message: 'Successfully fetched a single user!',
      type: 'users',
    });
  },

  /**
   * Gets all users in the database.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   */
  getUsers: async (req: Request, res: Response) => {
    const users = await UserService.getUsers();

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: users,
      message: 'Successfully fetched data of all users!',
      type: 'users',
    });
  },

  /**
   * Updates a single user. Has validations to ensure that the current user
   * does not use others phone number or email.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNumber, password, fullName, role, isActive } = req.body;
    const { id } = req.params;

    // Validate everything via 'Promise.all' for speed.
    const [userByID, userByEmail, userByPhone] = await Promise.all([
      UserService.getUser({ userID: id }),
      email ? UserService.getUser({ email }) : null,
      phoneNumber ? UserService.getUser({ phoneNumber }) : null,
    ]);

    // Perform validations.
    if (!userByID) {
      next(new AppError('The user with this ID does not exist!', 404));
      return;
    }

    if (userByEmail && userByEmail.userID !== userByEmail.userID) {
      next(new AppError('This email has been used by another user!', 400));
      return;
    }

    if (userByPhone && userByPhone.userID !== userByPhone.userID) {
      next(new AppError('This number has been used by another user!', 400));
      return;
    }

    // Everything is optional and sanitized according to the previous validation layer.
    const user = await UserService.updateUser(
      { userID: id },
      {
        email,
        phoneNumber,
        fullName,
        password,
        role,
        isActive,
      }
    );

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: user,
      message: 'Successfully updated a single user!',
      type: 'users',
    });
  },
};

export default UserController;
