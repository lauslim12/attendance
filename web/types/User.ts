import type Response from './Response';

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

export type UserResponse = Response<User>;
