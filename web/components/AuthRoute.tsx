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
 * A middleware, top-level component that prevents non-logged in users to access certain routes
 * in the client-side. Quite simple, if the user does not exist in the context / SWR,
 * then redirect to login screen.
 *
 * @param params - Props.
 * @returns React Functional Component
 */
const AuthRoute = ({ children }: Props) => {
  const { data, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !data.status?.isAuthenticated) {
      router.replace(routes.notAuthorized);
    }
  }, [isLoading, data.status, router]);

  if (isLoading || !data.status?.isAuthenticated) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default memo(AuthRoute);
