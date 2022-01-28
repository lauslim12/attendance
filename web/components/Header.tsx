import {
  Heading,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorMode,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { FaBars, FaUser, FaMoon, FaSignOutAlt } from 'react-icons/fa';

import { useStatusAndUser } from '../utils/hooks';
import axios from '../utils/http';
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
  const [largerThan1280] = useMediaQuery('(min-width: 1280px)');
  const toast = useToast();
  const router = useRouter();

  const logout = () => {
    // Does not need revalidation as it's definitely resetting its state.
    mutate({ isAuthenticated: false, isMFA: false, user: null }, false);

    axios({ method: 'POST', url: '/api/v1/auth/logout' })
      .then((res) => {
        SuccessToast(toast, res.message);
        router.replace(routes.home);
      })
      .catch((err) => FailedToast(toast, err.message));
  };

  return (
    <HStack as="nav" p={4} spacing={2}>
      <Heading as="h1" size="lg" fontWeight="extrabold">
        <NextLink href={routes.home} passHref>
          <Link _hover={{ textDecor: 'none', color: 'orange.400' }}>
            @attendance
          </Link>
        </NextLink>
      </Heading>

      <Spacer />

      {status && status.isAuthenticated && !largerThan1280 && (
        <Menu isLazy>
          <MenuButton
            as={IconButton}
            aria-label="Navigation and features"
            icon={<FaBars />}
            variant="outline"
          />

          <MenuList>
            <NextLink href={routes.profile} passHref>
              <Link>
                <MenuItem icon={<FaUser />}>Profile</MenuItem>
              </Link>
            </NextLink>

            <MenuItem icon={<FaSignOutAlt />} onClick={logout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {status && status.isAuthenticated && largerThan1280 && (
        <HStack>
          <NextLink href={routes.profile} passHref>
            <Link
              fontWeight="bold"
              _hover={{ textDecor: 'none', color: 'pink.400' }}
            >
              Profile
            </Link>
          </NextLink>

          <Text
            as="button"
            fontWeight="bold"
            _hover={{ textDecor: 'none', color: 'pink.400' }}
            onClick={logout}
          >
            Logout
          </Text>
        </HStack>
      )}

      {largerThan1280 && <Spacer />}

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
