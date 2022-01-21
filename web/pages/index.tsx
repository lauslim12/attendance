import { VStack } from '@chakra-ui/react';
import { memo } from 'react';

import Attendance from '../components/Home/Attendance';
import Main from '../components/Home/Main';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import useRequest from '../hooks/useRequest';
import type { Status } from '../types/Auth';

/**
 * Homepage of the website.
 *
 * @returns React functional component.
 */
const Home = () => {
  const { data: status, isLoading } = useRequest<Status>('/api/v1/auth/status');

  if (isLoading) return <Spinner />;

  return (
    <Layout title={['Home']}>
      <VStack
        as="section"
        align={['center', 'start', 'start']}
        justify="center"
        w={['full', 'full', '60vw']}
        h="full"
        margin="0 auto"
        p={2}
      >
        {status?.isAuthenticated ? <Attendance status={status} /> : <Main />}
      </VStack>
    </Layout>
  );
};

export default memo(Home);
