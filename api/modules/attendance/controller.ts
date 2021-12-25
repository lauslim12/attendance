import DeviceDetector from 'device-detector-js';
import { NextFunction, Request, Response } from 'express';
import requestIp from 'request-ip';

import AppError from '../../util/app-error';
import sendResponse from '../../util/send-response';
import UserService from '../user/service';
import AttendanceService from './service';

/**
 * Attendance controller, forwarded requests from 'handler'.
 */
const AttendanceController = {
  /**
   * Checks in a user inside the webservice. Algorithm:
   * - Ensure that the request is made within time (optional).
   * - Fetches the current user to get their primary key.
   * - Create an 'Attendance' object. Try to parse the user's IP and the user's device.
   * - Inserts a new 'Attendance' to the database.
   * - Send back response.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  in: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userID) {
      next(new AppError('No session detected. Please log in again!', 401));
      return;
    }

    // Gets complete user.
    const user = await UserService.getUserCompleteDataByID(req.session.userID);
    if (!user) {
      next(new AppError('User does not exist in the database!', 400));
      return;
    }

    // Checks whether a user has checked in for today, time is on UTC.
    const today = new Date();
    const checked = await AttendanceService.hasCheckedIn(today, user.userID);
    if (checked) {
      next(new AppError('You have already checked in for today!', 400));
      return;
    }

    // Parse headers.
    const agent = req.headers['user-agent'] ? req.headers['user-agent'] : '';
    const detected = new DeviceDetector().parse(agent);
    const userDevice = `${detected.client?.name} ${detected.client?.version} on ${detected.os?.name}`;

    // Shape request body to follow the 'attendance' data structure.
    const attendance = await AttendanceService.createAttendance({
      timeEnter: today,
      ipAddressEnter: requestIp.getClientIp(req) || 'Unknown IP',
      deviceEnter: userDevice,
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
};

export default AttendanceController;
