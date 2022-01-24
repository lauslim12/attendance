/**
 * JSONAPI standard response from the back-end.
 */
export interface Response<T> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data: T;
  type: 'general' | 'users' | 'attendance' | 'auth' | 'sessions';
  meta: {
    copyright: string;
    authors: string[];
  };
  jsonapi: {
    version: string;
  };
  links: {
    self: string;
  };
}

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

/**
 * Status from the back-end.
 */
export type Status = {
  isAuthenticated: boolean;
  isMFA: boolean;
  user: User | null;
};

/**
 * Session type from the back-end.
 */
export type Session = {
  cookie: {
    originalMaxAge: number;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    path: string;
    sameSite: 'strict' | 'lax' | 'none';
  };
  userID: string;
  userRole: 'admin' | 'user';
  lastActive: string;
  sessionInfo: {
    device: string;
    ip: string;
  };
  signedIn: string;
  sid: string;
};

/**
 * User type from the back-end.
 */
export type User = {
  userID: string;
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  isActive: string;
  updatedAt: string;
  createdAt: string;
  role: 'admin' | 'user';
};
