import type { Key } from 'swr';
import useSWR from 'swr';

import { fetcher } from '../utils/http';

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
const useRequest = <T>(key: Key) => {
  const { data, error, mutate } = useSWR<T>(key, fetcher);

  return {
    data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
};

export default useRequest;
