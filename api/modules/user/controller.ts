import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import sendResponse from '../../util/send-response';
import UserService from './service';

/**
 * Create controller to handle all requests forwarded from 'UserHandler'.
 */
const UserController = {
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
   * Creates a single user. Has several validations to ensure that the username,
   * email, and phone number are all unique and have not yet been used by another user.
   *
   * @param _ - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, phoneNumber, password, fullName } = req.body;

    if (await UserService.getUser({ username })) {
      next(new AppError('This username has existed already!', 400));
      return;
    }

    if (await UserService.getUser({ email })) {
      next(new AppError('This email has been used by another user!', 400));
      return;
    }

    if (await UserService.getUser({ phoneNumber })) {
      next(
        new AppError('This phone number has been used by another user!', 400)
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
   * Updates a single user. Has validations to ensure that the current user
   * does not use others phone number or email.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNumber, password, fullName } = req.body;
    const { id } = req.params;

    const currentUser = await UserService.getUser({ userID: id });
    if (!currentUser) {
      next(new AppError('The user with this ID does not exist!', 404));
      return;
    }

    const userByEmail = email ? await UserService.getUser({ email }) : null;
    if (userByEmail && userByEmail.userID !== currentUser.userID) {
      next(new AppError('This email has been used by another user!', 400));
      return;
    }

    const userByPhone = phoneNumber
      ? await UserService.getUser({ phoneNumber })
      : null;
    if (userByPhone && userByPhone.userID !== currentUser.userID) {
      next(new AppError('This number has been used by another user!', 400));
      return;
    }

    // everything is optional and sanitized according to the previous validation layer
    const user = await UserService.updateUser(
      { userID: id },
      {
        email,
        phoneNumber,
        fullName,
        password,
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

    res.status(204).send();
  },
};

export default UserController;
