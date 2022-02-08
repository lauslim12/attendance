import { VStack } from '@chakra-ui/react';
import { memo } from 'react';

import Layout from '../components/Layout';
import Clock from '../components/Pages/Home/Clock';
import CurrentStatus from '../components/Pages/Home/CurrentStatus';
import Greetings from '../components/Pages/Home/Greetings';
import Hello from '../components/Pages/Home/Hello';
import Links from '../components/Pages/Home/Links';
import Present from '../components/Pages/Home/Present';
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
        {status && status.isAuthenticated && status.user ? (
          <VStack w="full" align="center" spacing={4}>
            <Greetings fullName={status.user.fullName} />
            <Clock />
            <CurrentStatus status={status} />
            <Present status={status} />
          </VStack>
        ) : (
          <VStack w="full" align="center" spacing={4}>
            <Hello />
            <Links />
          </VStack>
        )}
      </VStack>
    </Layout>
  );
};

export default memo(Home);
