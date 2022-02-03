import { Button, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaHome } from 'react-icons/fa';

import Layout from '../components/Layout';
import MainHeading from '../components/MainHeading';
import routes from '../utils/routes';

/**
 * Renders a `403 Forbidden` page.
 *
 * @returns React functional component.
 */
const ForbiddenPage = () => (
  <Layout title={['Forbidden']}>
    <VStack
      as="section"
      w="full"
      h="full"
      justify="center"
      spacing={4}
      textAlign="center"
    >
      <MainHeading text="403 Forbidden!" />

      <Text>You are not authorized to access this page.</Text>

      <NextLink href={routes.home} passHref>
        <Button leftIcon={<FaHome />} colorScheme="green" variant="outline">
          Back to Home
        </Button>
      </NextLink>
    </VStack>
  </Layout>
);

export default memo(ForbiddenPage);
