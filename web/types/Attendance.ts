import type Response from './Response';

/**
 * Attendance response from the back-end.
 */
export type Attendance = {
  attendanceID: string;
  timeEnter: string;
  ipAddressEnter: string;
  deviceEnter: string;
  remarksEnter: string | null;
  timeLeave: string | null;
  ipAddressLeave: string | null;
  deviceLeave: string | null;
  remarksLeave: string | null;
  user: {
    userID: string;
    fullName: string;
  };
};

export type AttendanceStatus = {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
};

export type AttendanceResponse = Response<Attendance>;
