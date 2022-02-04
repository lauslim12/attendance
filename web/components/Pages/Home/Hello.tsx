import { Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';

import MainHeading from '../../MainHeading';

/**
 * Hello component.
 *
 * @returns Hello component.
 */
const Hello = () => (
  <VStack as="section" align="start" spacing={1}>
    <MainHeading
      text="Hello and Welcome! 👋"
      fontSize={['4xl', '4xl', '6xl']}
      mb={5}
    />

    <Text fontSize={['md', 'lg']}>
      Welcome to this web application. This is used to provide a proof of
      concept of a secure REST API using various security considerations (mainly
      with OTPs and MFAs with RFC 6238 and RFC 7617). The API is implemented as
      an attendance system to solve a real use-case. Help me to graduate by
      providing evaluations!
    </Text>
  </VStack>
);

export default memo(Hello);
