import type { Prisma } from '@prisma/client';

import prisma from '../../infra/prisma';

/**
 * Business logic and repositories for 'Attendance' entity.
 */
const AttendanceService = {
  /**
   * Creates a new attendance entry at the system.
   *
   * @param attendance - Attendance data.
   * @returns The created attendance data.
   */
  createAttendance: async (attendance: Prisma.AttendanceCreateInput) =>
    prisma.attendance.create({
      data: attendance,
      select: {
        attendanceID: true,
        timeEnter: true,
        ipAddressEnter: true,
        deviceEnter: true,
        remarksEnter: true,
        timeLeave: true,
        ipAddressLeave: true,
        deviceLeave: true,
        remarksLeave: true,
        user: {
          select: {
            userID: true,
            fullName: true,
          },
        },
      },
    }),

  /**
   * Fetches a single attendance based on 'timeLeave' and the associated user identifier.
   *
   * @param currentDate - Current date as a data object.
   * @param userID - A current user's ID.
   * @returns Attendance object.
   */
  checkedIn: async (currentDate: Date, userID: string) => {
    // find tomorrow's date
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

    // fetch attendance of a user between today and tomorrow with a certain user ID.
    // time has to be in 'YYYY-MM-DD' format, hence the 'toISOString()' function.
    const attendance = await prisma.attendance.findFirst({
      where: {
        user: {
          userID,
        },
        timeEnter: {
          gte: new Date(currentDate.toISOString().split('T')[0]),
          lt: new Date(tomorrow.toISOString().split('T')[0]),
        },
      },
    });

    // return attendance object
    return attendance;
  },

  /**
   * Fetches a single attendance based on 'timeLeave' and the associated user identifier.
   *
   * @param currentDate - Current date as a data object.
   * @param userID - A current user's ID.
   * @returns Attendance object.
   */
  checkedOut: async (currentDate: Date, userID: string) => {
    // find tomorrow's date
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

    // fetch attendance of a user between today and tomorrow with a certain user ID.
    // time has to be in 'YYYY-MM-DD' format, hence the 'toISOString()' function.
    const attendance = await prisma.attendance.findFirst({
      where: {
        user: {
          userID,
        },
        timeLeave: {
          gte: new Date(currentDate.toISOString().split('T')[0]),
          lt: new Date(tomorrow.toISOString().split('T')[0]),
        },
      },
    });

    // return attendance object
    return attendance;
  },

  /**
   * Gets all attendances data, either global, or all attendances data of a single user.
   *
   * @param userPK - User's primary key (optional).
   * @returns All attendance data.
   */
  getAttendances: async (userPK?: number) => {
    if (typeof userPK === 'undefined') {
      return prisma.attendance.findMany({
        select: {
          attendanceID: true,
          timeEnter: true,
          ipAddressEnter: true,
          deviceEnter: true,
          remarksEnter: true,
          timeLeave: true,
          ipAddressLeave: true,
          deviceLeave: true,
          remarksLeave: true,
          user: {
            select: {
              userID: true,
              fullName: true,
            },
          },
        },
      });
    }

    return prisma.attendance.findMany({
      where: {
        userPK,
      },
      select: {
        attendanceID: true,
        timeEnter: true,
        ipAddressEnter: true,
        deviceEnter: true,
        remarksEnter: true,
        timeLeave: true,
        ipAddressLeave: true,
        deviceLeave: true,
        remarksLeave: true,
        user: {
          select: {
            userID: true,
            fullName: true,
          },
        },
      },
    });
  },

  /**
   * Updates a single attendance based on ID.
   *
   * @param id - An attendance ID.
   * @param attendance - The new, updated data.
   * @returns Updated attendance data.
   */
  updateAttendance: async (
    id: string,
    attendance: Prisma.AttendanceUpdateInput
  ) =>
    prisma.attendance.update({
      where: { attendanceID: id },
      data: attendance,
      select: {
        attendanceID: true,
        timeEnter: true,
        ipAddressEnter: true,
        deviceEnter: true,
        remarksEnter: true,
        timeLeave: true,
        ipAddressLeave: true,
        deviceLeave: true,
        remarksLeave: true,
        user: {
          select: {
            userID: true,
            fullName: true,
          },
        },
      },
    }),
};

export default AttendanceService;
