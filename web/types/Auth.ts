import type { User } from './User';

/**
 * Status from the back-end.
 */
export type Status = {
  isAuthenticated: boolean;
  isMFA: boolean;
  user: User | null;
};
