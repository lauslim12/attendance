import type Response from './Response';

/**
 * Status from the back-end.
 */
export type Status = {
  isAuthenticated: boolean;
  isMFA: boolean;
};

export type StatusResponse = Response<Status>;
