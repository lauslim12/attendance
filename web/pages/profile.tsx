import { chakra, Text, Textarea } from '@chakra-ui/react';
import { memo } from 'react';

import AuthRoute from '../components/AuthRoute';
import Layout from '../components/Layout';
import { useMe } from '../utils/hooks';

/**
 * Profile page of the website.
 *
 * @returns React functional component.
 */
const Profile = () => {
  const { data } = useMe();

  return (
    <AuthRoute>
      <Layout title={['Profile']}>
        <Text>
          Welcome back to your profile, {data.status?.user?.fullName}!
        </Text>

        <chakra.code h="full">
          <Textarea value={JSON.stringify(data, null, 2)} h="full" />
        </chakra.code>
      </Layout>
    </AuthRoute>
  );
};

export default memo(Profile);
