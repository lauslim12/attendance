import type { Key } from 'swr';
import useSWR from 'swr';

import type { Attendance } from '../types/Attendance';
import type { Status } from '../types/Auth';
import type { Session } from '../types/Session';
import { fetcher } from './http';

/**
 * Hook to call a `GET` request with Vercel's `useSWR` for performance and reactive
 * applications. It is required to be supplied with 'T' for generic type safety.
 *
 * @example
 * const { data: me, error } = useRequest('/api/v1/users/me');
 * if (data) return <UserProfile user={me}} />
 * if (error) return <InternalServerError />
 *
 * @param key - Key argument to the SWR.
 * @returns An object consisting of the data, a boolean value whether
 * it is loading or not, an error if it exists, and a mutator function
 * to update the state again.
 */
export const useRequest = <T>(key: Key) => {
  const { data, error, mutate } = useSWR<T>(key, fetcher);

  return {
    data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

/**
 * Replaces the main context of the application, used in almost all parts
 * of the web application in order to keep track of the authentication state
 * of the current user.
 *
 * @returns An object of data, loading state, errors, and mutator function.
 */
export const useStatusAndUser = () => {
  const { data, error, mutate } = useSWR<Status>(
    '/api/v1/auth/status',
    fetcher
  );

  return {
    status: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

/**
 * A hook to get all of the required user data, used in the Profile page.
 *
 * @returns An object of status and user data, their attendance data, their sessions,
 * any errors that might exist as well.
 */
export const useMe = () => {
  const { data: status, error: statusError } = useSWR<Status>(
    '/api/v1/auth/status',
    fetcher
  );

  const { data: attendance, error: attendanceError } = useSWR<Attendance[]>(
    status?.user ? `/api/v1/users/${status.user.userID}/attendance` : null,
    fetcher
  );

  const { data: sessions, error: sessionsError } = useSWR<Session[]>(
    status?.user ? '/api/v1/sessions/me' : null,
    fetcher
  );

  const error = statusError || attendanceError || sessionsError;
  const data = { status, attendance, sessions };

  return {
    data,
    isLoading: !data && !error,
    isError: error,
  };
};
