import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import UserService from './service';

/**
 * Create controller to handle all requests forwarded from 'UserHandler'.
 */
const UserController = {
  /**
   * Gets all users in the database.
   *
   * @param _ - Express.js's request object.
   * @param res - Express.js's response object.
   */
  getUsers: async (_: Request, res: Response) => {
    const users = await UserService.getUsers();

    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched data of all users!',
      data: users,
    });
  },

  /**
   * Creates a single user.
   *
   * @param _ - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    if (await UserService.getUserByUsername(req.body.username)) {
      next(new AppError('This username has existed already!', 400));
      return;
    }

    if (await UserService.getUserByEmail(req.body.email)) {
      next(new AppError('This email has been used by another user!', 400));
      return;
    }

    if (await UserService.getUserByPhoneNumber(req.body.phoneNumber)) {
      next(
        new AppError('This phone number has been used by another user!', 400)
      );
      return;
    }

    const user = await UserService.createUser(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Successfully created a single user!',
      data: user,
    });
  },

  /**
   * Gets a single user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   */
  getUser: async (req: Request, res: Response) => {
    const user = await UserService.getUserByID(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Successfully fetched a single user!',
      data: user,
    });
  },

  /**
   * Updates a single user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    const { email, phoneNumber } = req.body;
    const { id } = req.params;

    const currentUser = await UserService.getUserByID(id);
    if (!currentUser) {
      next(new AppError('The user with this ID does not exist!', 404));
      return;
    }

    if (email) {
      const userByEmail = await UserService.getUserByEmail(email);
      if (userByEmail && userByEmail.userID !== currentUser.userID) {
        next(new AppError('This email has been used by another user!', 400));
        return;
      }
    }

    if (phoneNumber) {
      const userByPhone = await UserService.getUserByPhoneNumber(phoneNumber);
      if (userByPhone && userByPhone.userID !== currentUser.userID) {
        next(new AppError('This number has been used by another user!', 400));
        return;
      }
    }

    const user = await UserService.updateUser(req.params.id, req.body);

    res.status(200).json({
      status: 'success',
      message: 'Successfully updated a single user!',
      data: user,
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
    if (!(await UserService.getUserByID(req.params.id))) {
      next(new AppError('The user with this ID does not exist!', 404));
      return;
    }

    await UserService.deleteUser(req.params.id);

    res.status(204).send();
  },
};

export default UserController;
