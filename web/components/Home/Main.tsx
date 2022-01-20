import {
  Button,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaAddressCard, FaSignInAlt } from 'react-icons/fa';

import routes from '../../utils/routes';

/**
 * Main page of the website, renders if user is not logged in.
 *
 * @returns React functional component.
 */
const Main = () => (
  <>
    <Heading
      bgGradient={useColorModeValue(
        'linear(to-r, #00baff, #00baff, #063ef9)',
        'linear(to-r, #945bf1, #bb48bf, #bb48bf, #f67e4d)'
      )}
      bgClip="text"
      fontSize={['4xl', '4xl', '6xl']}
      fontWeight="extrabold"
      mb={5}
    >
      Hello and Welcome! 👋
    </Heading>

    <Text fontSize={['md', 'lg']}>
      Welcome to this web application. This is used to provide a proof of
      concept of a secure REST API using various security considerations (mainly
      with OTPs and MFAs with RFC 6238 and RFC 7617). The API is implemented as
      an attendance system to solve a real use-case. Help me to graduate by
      providing evaluations!
    </Text>

    <Stack justify="stretch" direction={['column', 'row']} w="full" pt={2}>
      <NextLink href={routes.register} passHref>
        <Button colorScheme="orange" leftIcon={<FaAddressCard />} isFullWidth>
          Sign up
        </Button>
      </NextLink>

      <NextLink href={routes.login} passHref>
        <Button colorScheme="blue" leftIcon={<FaSignInAlt />} isFullWidth>
          Log in
        </Button>
      </NextLink>
    </Stack>
  </>
);

export default memo(Main);
