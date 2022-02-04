import { Button, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaHome } from 'react-icons/fa';

import Layout from '../components/Layout';
import MainHeading from '../components/MainHeading';
import routes from '../utils/routes';

/**
 * Renders a `404 Not Found` page.
 *
 * @returns React functional component.
 */
const NotFoundPage = () => (
  <Layout title={['Not Found']}>
    <VStack
      as="section"
      w="full"
      h="full"
      justify="center"
      spacing={4}
      textAlign="center"
    >
      <MainHeading text="404 Page Not Found!" />

      <Text>
        Oops. The page you are looking may or may not have existed in the past,
        but it certainly does not now.
      </Text>

      <NextLink href={routes.home} passHref>
        <Button
          as="a"
          leftIcon={<FaHome />}
          colorScheme="green"
          variant="outline"
        >
          Back to Home
        </Button>
      </NextLink>
    </VStack>
  </Layout>
);

export default memo(NotFoundPage);
