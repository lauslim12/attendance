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
   * Checks whether the user has clocked in for today or not.
   *
   * @param currentDate - Current date as a data object.
   * @param userID - A current user's ID.
   * @returns Boolean value whether the user has already checked in or not.
   */
  hasCheckedIn: async (currentDate: Date, userID: string) => {
    // find tomorrow's date
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

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

    // if exists, return has checked in, else return false
    return attendance ? true : false;
  },
};

export default AttendanceService;
