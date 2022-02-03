import { Button, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaHome } from 'react-icons/fa';

import Layout from '../components/Layout';
import MainHeading from '../components/MainHeading';
import routes from '../utils/routes';

/**
 * Renders a `401 Unauthorized` page.
 *
 * @returns React functional component.
 */
const UnauthorizedPage = () => (
  <Layout title={['Unauthorized']}>
    <VStack
      as="section"
      w="full"
      h="full"
      justify="center"
      spacing={4}
      textAlign="center"
    >
      <MainHeading text="401 Unauthorized!" />

      <Text>
        Oops. You are not authorized to access this page. Please log in first.
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

export default memo(UnauthorizedPage);
