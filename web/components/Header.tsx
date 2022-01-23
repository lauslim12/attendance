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

import useRequest from '../hooks/useRequest';
import type { Status } from '../types/Auth';
import type Response from '../types/Response';
import { User } from '../types/User';
import axios from '../utils/http';
import routes from '../utils/routes';
import { FailedToast, SuccessToast } from './Toast';

/**
 * Header of the whole application.
 *
 * @returns React Functional Component.
 */
const Header = () => {
  const { data: status, mutate: mutateStatus } = useRequest<Status>(
    '/api/v1/auth/status'
  );
  const { mutate: mutateUser } = useRequest<User>('/api/v1/users/me');
  const { toggleColorMode } = useColorMode();
  const toast = useToast();

  const logout = () => {
    mutateStatus({ isAuthenticated: false, isMFA: false }, false);
    mutateUser(undefined, false);

    axios<Response<unknown>>({ method: 'POST', url: '/api/v1/auth/logout' })
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
        <Text as="button" onClick={logout}>
          Logout
        </Text>
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
