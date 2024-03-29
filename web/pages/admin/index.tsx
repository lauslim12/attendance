import { Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';
import { FaCheckDouble, FaDatabase } from 'react-icons/fa';

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
    <>
      {status && status.user && (
        <Layout title={['Admin']}>
          <VStack as="section" spacing={3} h="full" justify="center">
            <Heading size="md">Welcome, {status.user.fullName}!</Heading>

            <Text textAlign={['center', 'left']}>
              {status.isMFA
                ? 'Check out below menu for the configurations you may need to do.'
                : 'Please authorize yourself before performing operations.'}
            </Text>

            {status.isMFA ? (
              <Grid
                pt={5}
                templateColumns={['1fr', '1fr', '1fr', 'repeat(2, 1fr)']}
                gap={5}
                w={['full', '80vw', '80vw', '80vw', '70vw', '50vw']}
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
    </>
  );
};

export default memo(Admin);
