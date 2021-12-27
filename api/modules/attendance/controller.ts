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
   * Gets all attendances.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  getAttendances: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userID) {
      next(new AppError('No session detected. Please log in again!', 401));
      return;
    }

    const withUser = !!req.params.id;
    if (withUser) {
      const user = await UserService.getUserCompleteDataByID(req.params.id);
      if (!user) {
        next(new AppError('No user found with that ID.', 404));
        return;
      }

      const attendances = await AttendanceService.getAttendances(user.userPK);

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

    // Checks whether a user has clocked in for today, time is on UTC.
    const today = new Date();
    const checked = await AttendanceService.checkedIn(today, user.userID);
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
      remarksEnter: req.body.remarksEnter,
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

    // Checks whether the user has already checked out for today.
    const today = new Date();
    const out = await AttendanceService.checkedOut(today, user.userID);
    if (out) {
      next(new AppError('You have checked out for today!', 400));
      return;
    }

    // Checks whether the user has clocked in for today. Time is on UTC.
    const checked = await AttendanceService.checkedIn(today, user.userID);
    if (!checked) {
      next(new AppError('You have not yet checked in for today!', 400));
      return;
    }

    // Parse headers.
    const agent = req.headers['user-agent'] ? req.headers['user-agent'] : '';
    const detected = new DeviceDetector().parse(agent);
    const userDevice = `${detected.client?.name} ${detected.client?.version} on ${detected.os?.name}`;

    // Shape request body to follow the 'attendance' data structure.
    const attendance = await AttendanceService.updateAttendance(
      checked.attendanceID,
      {
        timeLeave: today,
        ipAddressLeave: requestIp.getClientIp(req) || 'Unknown IP',
        deviceLeave: userDevice,
        remarksLeave: req.body.remarksLeave,
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
