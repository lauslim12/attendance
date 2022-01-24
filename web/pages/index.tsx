import { VStack } from '@chakra-ui/react';
import { memo } from 'react';

import Attendance from '../components/Home/Attendance';
import Main from '../components/Home/Main';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { useStatusAndUser } from '../utils/hooks';

/**
 * Homepage of the website.
 *
 * @returns React functional component.
 */
const Home = () => {
  const { status, isLoading } = useStatusAndUser();

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
