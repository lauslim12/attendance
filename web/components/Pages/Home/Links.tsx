import { Button, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaAddressCard, FaSignInAlt } from 'react-icons/fa';

import routes from '../../../utils/routes';

/**
 * Collection of links.
 *
 * @returns Links component.
 */
const Links = () => (
  <Stack
    as="section"
    justify="stretch"
    direction={['column', 'row']}
    w="full"
    pt={2}
  >
    <NextLink href={routes.register} passHref>
      <Button as="a" colorScheme="orange" leftIcon={<FaAddressCard />} w="full">
        Sign up
      </Button>
    </NextLink>

    <NextLink href={routes.login} passHref>
      <Button as="a" colorScheme="blue" leftIcon={<FaSignInAlt />} w="full">
        Log in
      </Button>
    </NextLink>
  </Stack>
);

export default memo(Links);
