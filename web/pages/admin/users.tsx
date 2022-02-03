import { Button, Grid, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';

import AdminRoute from '../../components/Admin/AdminRoute';
import NotMFA from '../../components/Admin/NotMFA';
import UserCard from '../../components/Admin/UserCard';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { useUsers } from '../../utils/hooks';
import routes from '../../utils/routes';

/**
 * Users page for administrators.
 *
 * @returns React functional component.
 */
const Users = () => {
  const { users, isLoading, isError } = useUsers();

  if (isLoading) return <Spinner />;

  return (
    <AdminRoute>
      <Layout title={['Users']}>
        {isError && <NotMFA error={isError} />}

        {!isError && (
          <VStack align="start" as="section">
            <HStack w="full">
              <Text as="p" fontWeight="bold" fontSize="2xl">
                Users
              </Text>

              <Spacer />

              <HStack>
                <NextLink href={routes.admin} passHref>
                  <Button
                    as="a"
                    size="sm"
                    leftIcon={<FaArrowLeft />}
                    colorScheme="green"
                  >
                    Back
                  </Button>
                </NextLink>

                <Button size="sm" leftIcon={<FaCheck />} colorScheme="orange">
                  Create User
                </Button>
              </HStack>
            </HStack>

            <Grid
              templateColumns={[
                'repeat(2, 1fr)',
                'repeat(4, 1fr)',
                'repeat(6, 1fr)',
              ]}
              gap={4}
              pt={2}
            >
              {users &&
                users.map((user) => <UserCard key={user.userID} user={user} />)}
            </Grid>
          </VStack>
        )}
      </Layout>
    </AdminRoute>
  );
};

export default memo(Users);
