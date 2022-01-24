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

/**
 * Attendance status to check whether the user has
 * already checked their attendance.
 */
export type AttendanceStatus = {
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
};
