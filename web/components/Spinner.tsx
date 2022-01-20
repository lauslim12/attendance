import { Spinner as ChakraSpinner, Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';

/**
 * Application loader when the browser is loading something, such as localizations.
 *
 * @returns React Functional Component
 */
const Spinner = () => (
  <VStack w="100vw" h="100vh" align="center" justify="center">
    <ChakraSpinner
      size="xl"
      thickness="5px"
      emptyColor="gray.200"
      color="pink.400"
    />

    <Text textAlign="center">Loading...</Text>
  </VStack>
);

export default memo(Spinner);
