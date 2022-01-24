import {
  Heading,
  HStack,
  IconButton,
  Link,
  Spacer,
  Text,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaMoon } from 'react-icons/fa';

import { useStatusAndUser } from '../utils/hooks';
import { api } from '../utils/http';
import routes from '../utils/routes';
import { FailedToast, SuccessToast } from './Toast';

/**
 * Header of the whole application.
 *
 * @returns React Functional Component.
 */
const Header = () => {
  const { status, mutate } = useStatusAndUser();
  const { toggleColorMode } = useColorMode();
  const toast = useToast();

  const logout = () => {
    // Does not need revalidation as it's definitely resetting its state.
    mutate({ isAuthenticated: false, isMFA: false, user: null }, false);

    api({ method: 'POST', url: '/api/v1/auth/logout' })
      .then((res) => SuccessToast(toast, res.message))
      .catch((err) => FailedToast(toast, err.message));
  };

  return (
    <HStack as="nav" p={4} spacing={2}>
      <Heading size="lg" fontWeight="extrabold">
        <NextLink href={routes.home} passHref>
          <Link _hover={{ textDecor: 'none', color: 'orange.400' }}>
            @attendance
          </Link>
        </NextLink>
      </Heading>

      <Spacer />

      {status && status.isAuthenticated ? (
        <HStack>
          <NextLink href={routes.profile} passHref>
            <Link>Profile</Link>
          </NextLink>

          <Text as="button" onClick={logout}>
            Logout
          </Text>
        </HStack>
      ) : (
        <Text>About</Text>
      )}

      <Spacer />

      <IconButton
        onClick={toggleColorMode}
        aria-label="Switch color mode"
        icon={<FaMoon />}
        variant="ghost"
      />
    </HStack>
  );
};

export default memo(Header);
