import { Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';
import { FaCheckDouble, FaDatabase } from 'react-icons/fa';

import AdminRoute from '../../components/Admin/AdminRoute';
import MenuCard from '../../components/Card/MenuCard';
import Layout from '../../components/Layout';
import MFAButton from '../../components/MFAButton';
import Spinner from '../../components/Spinner';
import { useStatusAndUser } from '../../utils/hooks';
import routes from '../../utils/routes';

/**
 * Admin panel of the website.
 *
 * @returns React functional component.
 */
const Admin = () => {
  const { status, isLoading } = useStatusAndUser();

  if (isLoading) return <Spinner />;

  return (
    <AdminRoute>
      {status && status.user && (
        <Layout title={['Admin']}>
          <VStack as="section" spacing={3}>
            <Heading size="md">Welcome, {status.user.fullName}!</Heading>

            <Text>
              {status.isMFA
                ? 'Check out below menu for the configurations you may need to do.'
                : 'Please authorize yourself before performing operations.'}
            </Text>

            {status.isMFA ? (
              <Grid
                pt={5}
                templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
                gap={5}
                w={['full', '60vw', '50vw']}
              >
                <MenuCard
                  header="Users"
                  description="Configuration of users"
                  icon={FaDatabase}
                  gradientAim="to-br"
                  gradientStart="#a5dd72"
                  gradientEnd="#83c77c"
                  href={routes.users}
                />

                <MenuCard
                  header="Attendances"
                  description="Report of all user attendances"
                  icon={FaCheckDouble}
                  gradientAim="to-bl"
                  gradientStart="#f5c042"
                  gradientEnd="#f8cc47"
                  href={routes.attendances}
                />
              </Grid>
            ) : (
              <MFAButton type="blue" user={status.user} />
            )}
          </VStack>
        </Layout>
      )}
    </AdminRoute>
  );
};

export default memo(Admin);
