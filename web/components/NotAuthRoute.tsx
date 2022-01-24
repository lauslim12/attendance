import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { memo, useEffect } from 'react';

import { useMe } from '../utils/hooks';
import routes from '../utils/routes';
import Spinner from './Spinner';

/**
 * Props.
 */
type Props = {
  children: ReactNode;
};

/**
 * The reverse of `AuthRoute`, this one disallows people to access pages like
 * '/login' if already logged in.
 *
 * @param params - Props.
 * @returns React Functional Component
 */
const NotAuthRoute = ({ children }: Props) => {
  const { data, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data.status?.isAuthenticated) {
      router.replace(routes.home);
    }
  }, [isLoading, data.status, router]);

  if (isLoading || data.status?.isAuthenticated) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default memo(NotAuthRoute);
