import useSWR from 'swr';

import type { Attendance } from '../types/Attendance';
import type { Status } from '../types/Auth';
import type { Session } from '../types/Session';
import type { User } from '../types/User';
import { fetcher } from '../utils/http';

const useMe = () => {
  const { data: me, error: meError } = useSWR<User>(
    '/api/v1/users/me',
    fetcher
  );

  const { data: status, error: statusError } = useSWR<Status>(
    '/api/v1/auth/status',
    fetcher
  );

  const { data: attendance, error: attendanceError } = useSWR<Attendance[]>(
    () => (me ? `/api/v1/users/${me.userID}/attendance` : null),
    fetcher
  );

  const { data: sessions, error: sessionsError } = useSWR<Session[]>(
    me ? '/api/v1/sessions/me' : null,
    fetcher
  );

  const error = meError || statusError || attendanceError || sessionsError;

  const data = {
    user: me,
    status,
    attendance,
    sessions,
  };

  console.log(data);

  return {
    data,
    isLoading: !data && !error,
    isError: error,
  };
};

export default useMe;
