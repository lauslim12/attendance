import { Spinner as ChakraSpinner, Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';

import Head from './Layout/Head';

/**
 * Application loader when the browser is loading something, such as localizations. This is
 * intentionally enhanced with browser functionalities and Next's Head class.
 *
 * @returns React Functional Component
 */
const Spinner = () => (
  <>
    <Head />

    <VStack as="main" w="100vw" h="100vh" align="center" justify="center">
      <ChakraSpinner
        size="xl"
        thickness="3px"
        emptyColor="gray.200"
        color="orange.400"
        label="Loading spinner"
        speed="0.5s"
      />

      <Text as="h1" textAlign="center" pt={2}>
        Loading...
      </Text>
    </VStack>
  </>
);

export default memo(Spinner);
