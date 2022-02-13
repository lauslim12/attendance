import type { Key } from 'swr';
import useSWR from 'swr';

import { fetcher } from './http';
import type { Attendance, Session, Status, User } from './types';

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
 * Fetches all attendances data.
 *
 * @returns An object of attendances data, a loading bar, an error, and the setter.
 */
export const useAttendances = () => {
  const { data, error, mutate } = useSWR<Attendance[]>(
    '/api/v1/attendances',
    fetcher
  );

  return {
    attendances: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

/**
 * Hook to get the current user's attendances status.
 *
 * @returns An object of booleans, whether the user has checked in/out or not.
 */
export const useAttendanceStatus = () => {
  const { status } = useStatusAndUser();
  const { data, error, mutate } = useSWR<{
    hasCheckedIn: boolean;
    hasCheckedOut: boolean;
  }>(status?.isAuthenticated && '/api/v1/attendances/status', fetcher);

  return {
    attendanceStatus: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

/**
 * Replaces the main context of the application, used in almost all parts
 * of the web application in order to keep track of the authentication state
 * of the current user. Revalidates itself every 15 seconds.
 *
 * @returns An object of data, loading state, errors, and mutator function.
 */
export const useStatusAndUser = () => {
  const { data, error, mutate } = useSWR<Status>(
    '/api/v1/auth/status',
    fetcher,
    { refreshInterval: 15000 }
  );

  return {
    status: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

/**
 * A hook to get all of the required user data, used in the Profile page. Will kick out
 * the user from the profile page if the user is not logged in.
 *
 * @returns An object of status and user data, their attendance data, their sessions,
 * any errors that might exist as well.
 */
export const useMe = () => {
  const {
    data: status,
    error: statusError,
    mutate: mutateStatus,
  } = useSWR<Status>('/api/v1/auth/status', fetcher);

  const {
    data: attendance,
    error: attendanceError,
    mutate: mutateAttendance,
  } = useSWR<Attendance[]>(
    status?.isAuthenticated && status.user ? `/api/v1/attendances/me` : null,
    fetcher
  );

  const {
    data: sessions,
    error: sessionsError,
    mutate: mutateSession,
  } = useSWR<Session[]>(
    status?.isAuthenticated && status.user ? '/api/v1/sessions/me' : null,
    fetcher
  );

  // Declare return values.
  const data = { status, attendance, sessions };
  const error = statusError || attendanceError || sessionsError;
  const isLoading = !status && !attendance && !sessions && !error;
  const mutate = { mutateStatus, mutateAttendance, mutateSession };

  return {
    data,
    isLoading,
    isError: error,
    mutate,
  };
};

/**
 * A hook to get all user data. This hook will prevent automatic retrying on errors to
 * save memory.
 *
 * @returns An object of users data, an error object, and a setter function.
 */
export const useUsers = () => {
  const { data, error, mutate } = useSWR<User[]>('/api/v1/users', fetcher, {
    onErrorRetry: (err) => {
      if (err.statusCode === 401) return;
    },
  });

  return {
    users: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};
