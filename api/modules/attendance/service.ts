import { Prisma } from '@prisma/client';

import prisma from '../../infra/prisma';

/**
 * All of the return types will return these attributes. This is the default
 * for filtered queries, as we have no need to return sensitive attributes such
 * as secrets and/or passwords.
 */
const select = Prisma.validator<Prisma.AttendanceSelect>()({
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
});

/**
 * Formats a date into 'YYYY/MM/DD' format with the time being 00:00. This little
 * hack is required for Prisma's 'BETWEEN' queries. We do not use 'toISOString()' to
 * prevent timezone clashing (sometimes it can go back a single day).
 *
 * @param date - Date to be formatted.
 * @returns Date in 'YYYY/MM/DD' (00:00) as a Date object.
 */
const formatDate = (date: Date) => new Date(date.toLocaleDateString('en-ZA'));

/**
 * Business logic and repositories for 'Attendance' entity.
 */
const AttendanceService = {
  /**
   * Fetches a single attendance based on 'timeLeave' or 'timeEnter' and the associated user identifier.
   * Algorithm:
   * - Find tomorrow's date.
   * - Parse dates to be in 'YYYY-MM-DD' format for both dates (tomorrow and today).
   * - Find first occurence of an attendance based on user id and whose 'timeEnter' (or 'timeLeave')
   * is between today and tomorrow (based on arguments).
   *
   * @param date - Current date as a 'Date' object.
   * @param userID - A user's ID.
   * @param type - A type to check the attendance, based on 'timeEnter' or 'timeLeave'.
   * @returns A single attendance object.
   */
  checked: async (date: Date, userID: string, type: 'in' | 'out') => {
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

    if (type === 'in') {
      return prisma.attendance.findFirst({
        where: {
          user: { userID },
          timeEnter: { gte: formatDate(date), lt: formatDate(tomorrow) },
        },
      });
    }

    return prisma.attendance.findFirst({
      where: {
        user: { userID },
        timeLeave: { gte: formatDate(date), lt: formatDate(tomorrow) },
      },
    });
  },

  /**
   * Creates a new attendance entry at the system.
   *
   * @param data - Attendance data.
   * @returns The created attendance data.
   */
  createAttendance: async (data: Prisma.AttendanceCreateInput) =>
    prisma.attendance.create({ data, select }),

  /**
   * Gets all attendances data, either global, or all attendances data of a single user.
   *
   * @param where - Prisma's 'Where' object, accepts unique and/or non unique attributes.
   * @returns All attendance data.
   */
  getAttendances: async (where?: Prisma.AttendanceWhereInput) => {
    if (typeof where === 'undefined') {
      return prisma.attendance.findMany({ select });
    }

    return prisma.attendance.findMany({ where, select });
  },

  /**
   * Updates a single attendance based on ID.
   *
   * @param where - Prisma's 'Where' object, only accepts unique identifiers.
   * @param data - The new, updated data.
   * @returns Updated attendance data.
   */
  updateAttendance: async (
    where: Prisma.AttendanceWhereUniqueInput,
    data: Prisma.AttendanceUpdateInput
  ) => prisma.attendance.update({ where, data, select }),
};

export default AttendanceService;
