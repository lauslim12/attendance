import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { memo, useEffect } from 'react';

import { useMe } from '../../../utils/hooks';
import routes from '../../../utils/routes';
import Spinner from '../../Spinner';

/**
 * Props.
 */
type Props = {
  children: ReactNode;
  adminRoutes: string[];
};

/**
 * A middleware, top-level component that prevents non-admin users from accessing this route.
 * We have to wrap this under `AuthRoute`, as it handles the authentication, this handles the
 * authorization.
 *
 * @param params - Props.
 * @returns React Functional Component
 */
const AdminRoute = ({ children, adminRoutes }: Props) => {
  const { data, isLoading } = useMe();
  const router = useRouter();
  const isPathProtected = adminRoutes.indexOf(router.pathname) !== -1;

  useEffect(() => {
    const isAdmin = data.status?.user?.role === 'admin';

    if (!isLoading && !isAdmin && isPathProtected) {
      router.replace(routes.forbidden);
    }
  }, [data.status?.user?.role, isLoading, router, isPathProtected]);

  if ((isLoading || data.status?.user?.role !== 'admin') && isPathProtected) {
    return <Spinner />;
  }

  return <>{children}</>;
};

export default memo(AdminRoute);
