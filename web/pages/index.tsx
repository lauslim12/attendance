import {
  Button,
  Heading,
  Stack,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { FaAddressCard, FaSignInAlt } from 'react-icons/fa';

import Layout from '../components/Layout';

/**
 * Homepage of the website.
 *
 * @returns React functional component.
 */
const Home: NextPage = () => {
  const { colorMode } = useColorMode();

  return (
    <Layout title={['Home']}>
      <VStack
        align={['center', 'start', 'start']}
        justify="center"
        w={['full', 'full', '60vw']}
        h="full"
        margin="0 auto"
        p={2}
      >
        <Heading
          bgGradient={
            colorMode === 'dark'
              ? 'linear(to-r, #945bf1, #bb48bf, #bb48bf, #f67e4d)'
              : 'linear(to-r, #00baff, #00baff, #063ef9)'
          }
          bgClip="text"
          fontSize={['4xl', '4xl', '6xl']}
          fontWeight="extrabold"
          mb={5}
        >
          Hello and Welcome! 👋
        </Heading>

        <Text fontSize={['md', 'lg']}>
          Welcome to this web application. This is used to provide a proof of
          concept of a secure REST API using various security considerations
          (mainly with OTPs and MFAs with RFC 6238 and RFC 7617). The API is
          implemented as an attendance system to solve a real use-case. Help me
          to graduate by providing evaluations!
        </Text>

        <Stack justify="stretch" direction={['column', 'row']} w="full" pt={2}>
          <Button
            size="lg"
            colorScheme="orange"
            leftIcon={<FaAddressCard />}
            isFullWidth
          >
            Sign up
          </Button>

          <Button
            size="lg"
            colorScheme="blue"
            leftIcon={<FaSignInAlt />}
            isFullWidth
          >
            Log in
          </Button>
        </Stack>
      </VStack>
    </Layout>
  );
};

export default Home;
