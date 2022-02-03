import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { memo, useEffect } from 'react';

import { useMe } from '../../utils/hooks';
import routes from '../../utils/routes';
import Spinner from '../Spinner';

/**
 * Props.
 */
type Props = {
  children: ReactNode;
};

/**
 * A middleware, top-level component that prevents non-admin users from accessing this route.
 *
 * @param params - Props.
 * @returns React Functional Component
 */
const AdminRoute = ({ children }: Props) => {
  const { data, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = data.status?.isAuthenticated;
    const isAuthorized = data.status?.user?.role === 'admin';

    if (!isLoading && !isAuthenticated) {
      router.replace(routes.notAuthorized);
    }

    if (!isLoading && isAuthenticated && !isAuthorized) {
      router.replace(routes.forbidden);
    }
  }, [isLoading, data.status, router]);

  if (
    isLoading ||
    !data.status?.isAuthenticated ||
    data.status.user?.role !== 'admin'
  ) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default memo(AdminRoute);
