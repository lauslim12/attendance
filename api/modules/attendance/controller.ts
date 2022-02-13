import type { NextFunction, Request, Response } from 'express';

import AppError from '../../util/app-error';
import getDeviceID from '../../util/device-id';
import sendResponse from '../../util/send-response';
import UserService from '../user/service';
import AttendanceService from './service';

/**
 * Attendance controller, forwarded requests from 'handler'.
 */
const AttendanceController = {
  /**
   * Gets all attendances, either (depends on the path parameter):
   * - Attendances of a single user.
   * - All attendances that have been logged into the system.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  getAttendances: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.session;
    const { id } = req.params;

    if (!userID) {
      next(new AppError('No session detected. Please log in again!', 401));
      return;
    }

    // If 'req.params' is not null, it means that we're trying to get the attendance
    // data of a single user instead of getting all attendance data.
    if (id) {
      const user = await UserService.getUserComplete({ userID: id });
      if (!user) {
        next(new AppError('No user found with that ID.', 404));
        return;
      }

      const attendances = await AttendanceService.getAttendances({
        userPK: user.userPK,
      });

      sendResponse({
        req,
        res,
        status: 'success',
        statusCode: 200,
        data: attendances,
        message: 'Successfully fetched all attendances data for a single user.',
        type: 'attendance',
      });
      return;
    }

    const attendances = await AttendanceService.getAttendances();
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: attendances,
      message: 'Successfully fetched all attendances data!',
      type: 'attendance',
    });
  },

  /**
   * Gets all attendances of a single user by their session ID.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  getMyAttendances: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.session;

    if (!userID) {
      next(new AppError('No session detected. Please log in again!', 401));
      return;
    }

    const user = await UserService.getUserComplete({ userID });
    if (!user) {
      next(new AppError('User with this ID is not found.', 404));
      return;
    }

    const attendances = await AttendanceService.getAttendances({
      userPK: user.userPK,
    });
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: attendances,
      message: 'Successfully fetched attendance data for a single user!',
      type: 'attendance',
    });
  },

  /**
   * Gets the attendance status of the current user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.session;
    if (!userID) {
      next(new AppError('No session detected. Please log in again!', 401));
      return;
    }

    const today = new Date();
    const [inData, outData] = await Promise.all([
      AttendanceService.checked(today, userID, 'in'),
      AttendanceService.checked(today, userID, 'out'),
    ]);

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: { hasCheckedIn: !!inData, hasCheckedOut: !!outData },
      message: 'Successfully fetched attendance status for the current user!',
      type: 'attendance',
    });
  },

  /**
   * Checks in a user inside the webservice. Algorithm:
   * - Ensure that the request is made within time (optional).
   * - Fetches the current user to get their identifier.
   * - Create an 'Attendance' object. Try to parse the user's IP and the user's device.
   * - Inserts a new 'Attendance' to the database.
   * - Send back response.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  in: async (req: Request, res: Response, next: NextFunction) => {
    const { remarksEnter } = req.body;
    const { userID } = req.session;

    if (!userID) {
      next(new AppError('No session detected. Please log in again!', 401));
      return;
    }

    // Gets complete user.
    const user = await UserService.getUserComplete({ userID });
    if (!user) {
      next(new AppError('User does not exist in the database!', 400));
      return;
    }

    // Checks whether a user has clocked in for today, time is on UTC.
    const today = new Date();
    const checked = await AttendanceService.checked(today, user.userID, 'in');
    if (checked) {
      next(new AppError('You have already checked in for today!', 400));
      return;
    }

    // Shape request body to follow the 'attendance' data structure.
    const attendance = await AttendanceService.createAttendance({
      timeEnter: today,
      ipAddressEnter: getDeviceID(req).ip,
      deviceEnter: getDeviceID(req).device,
      remarksEnter,
      user: { connect: { userPK: user.userPK } },
    });

    // Send back response.
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 201,
      data: attendance,
      message: 'Successfully checked-in for today in the webservice!',
      type: 'attendance',
    });
  },

  /**
   * Checks out a user inside the webservice. Algorithm:
   * - Ensure that the request is made within time (optional).
   * - Fetches the current user to get their identifier.
   * - Validate a user, does they have already clocked out or not?
   * - Try to check if the user has clocked-in for today. If they have not yet, reject. Get the ID of the attendance.
   * - Create an 'Attendance' object. Try to parse the user's IP and the user's device.
   * - Inserts a new 'Attendance' to the database.
   * - Send back response.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  out: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.session;
    const { remarksLeave } = req.body;

    if (!userID) {
      next(new AppError('No session detected. Please log in again!', 401));
      return;
    }

    // Gets complete user.
    const user = await UserService.getUserComplete({ userID });
    if (!user) {
      next(new AppError('User does not exist in the database!', 400));
      return;
    }

    // Checks whether the user has already checked out for today.
    const today = new Date();
    const out = await AttendanceService.checked(today, user.userID, 'out');
    if (out) {
      next(new AppError('You have checked out for today!', 400));
      return;
    }

    // Checks whether the user has clocked in for today. Time is on UTC.
    const checked = await AttendanceService.checked(today, user.userID, 'in');
    if (!checked) {
      next(new AppError('You have not yet checked in for today!', 400));
      return;
    }

    // Shape request body to follow the 'attendance' data structure.
    const attendance = await AttendanceService.updateAttendance(
      { attendanceID: checked.attendanceID },
      {
        timeLeave: today,
        ipAddressLeave: getDeviceID(req).ip,
        deviceLeave: getDeviceID(req).device,
        remarksLeave,
      }
    );

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 201,
      data: attendance,
      message: 'Successfully checked-out for today in the webservice!',
      type: 'attendance',
    });
  },
};

export default AttendanceController;
