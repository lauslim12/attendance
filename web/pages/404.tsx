import { Button, Heading, Text, useColorMode, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaHome } from 'react-icons/fa';

import Layout from '../components/Layout';
import routes from '../utils/routes';

/**
 * Renders a `404 Not Found` page.
 *
 * @returns React functional component.
 */
const NotFoundPage = () => {
  const { colorMode } = useColorMode();

  return (
    <Layout title={['Not Found']}>
      <VStack
        as="section"
        w="full"
        h="full"
        justify="center"
        spacing={4}
        textAlign="center"
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
        >
          404 Page Not Found!
        </Heading>

        <Text>
          Oops. The page you are looking may or may not have existed in the
          past, but it certainly does not now.
        </Text>

        <NextLink href={routes.home} passHref>
          <Button leftIcon={<FaHome />} colorScheme="green" variant="outline">
            Back to Home
          </Button>
        </NextLink>
      </VStack>
    </Layout>
  );
};

export default memo(NotFoundPage);
