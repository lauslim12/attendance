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
import { memo, useEffect, useState } from 'react';
import {
  FaBars,
  FaCircle,
  FaDatabase,
  FaLightbulb,
  FaMoon,
  FaShieldAlt,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';

import { useStatusAndUser } from '../../utils/hooks';
import axios from '../../utils/http';
import routes from '../../utils/routes';
import { FailedToast, SuccessToast } from '../Toast';

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

  // Redundant, to prevent 'did not expect server HTML to contain' error.
  const [isWidescreen, setIsWidescreen] = useState(false);
  useEffect(() => {
    setIsWidescreen(largerThan1280);
  }, [largerThan1280]);

  const logout = () => {
    axios({ method: 'POST', url: '/api/v1/auth/logout' })
      .then((res) => SuccessToast(toast, res.message))
      .catch((err) => FailedToast(toast, err.message))
      .finally(() =>
        // After done pushing the URL stack, we mutate our state
        // regardless of the results of the log out request.
        router.push(routes.home).then(() =>
          // Does not need revalidation as it is resetting its state.
          mutate({ isAuthenticated: false, isMFA: false, user: null }, false)
        )
      );
  };

  return (
    <HStack as="nav" p={4} spacing={1}>
      <Heading as="h1" size="lg" fontWeight="extrabold">
        <NextLink href={routes.home} passHref>
          <Link _hover={{ textDecor: 'none', color: 'orange.400' }}>
            @attendance
          </Link>
        </NextLink>
      </Heading>

      <Spacer />

      {status && status.isAuthenticated && largerThan1280 && (
        <HStack spacing={10} pt={4}>
          <NextLink href={routes.profile} passHref>
            <Link
              fontWeight="semibold"
              _hover={{ textDecor: 'none', color: 'pink.400' }}
            >
              Profile
            </Link>
          </NextLink>

          <Text
            as="button"
            fontWeight="semibold"
            _hover={{ textDecor: 'none', color: 'pink.400' }}
            onClick={logout}
          >
            Logout
          </Text>

          {status.user?.role === 'admin' && (
            <NextLink href={routes.admin} passHref>
              <Link
                fontWeight="semibold"
                _hover={{ textDecor: 'none', color: 'pink.400' }}
              >
                Admin
              </Link>
            </NextLink>
          )}
        </HStack>
      )}

      {isWidescreen && <Spacer />}

      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="Authentication status"
          icon={<FaShieldAlt />}
          variant="ghost"
        />

        <MenuList>
          {status?.user?.fullName ? (
            <NextLink href={routes.profile} passHref>
              <Link>
                <MenuItem icon={<FaLightbulb />}>
                  Signed in as {status.user.fullName.split(' ')[0]}
                </MenuItem>
              </Link>
            </NextLink>
          ) : (
            <MenuItem icon={<FaLightbulb />}>Signed out</MenuItem>
          )}

          <MenuItem
            icon={<FaCircle />}
            color={status?.isAuthenticated ? 'green.400' : 'red.400'}
          >
            Authentication
          </MenuItem>
          <MenuItem
            icon={<FaCircle />}
            color={status?.isMFA ? 'green.400' : 'red.400'}
          >
            MFA Authorization
          </MenuItem>
        </MenuList>
      </Menu>

      <IconButton
        onClick={toggleColorMode}
        aria-label="Switch color mode"
        icon={<FaMoon />}
        variant="ghost"
      />

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

            {status.user?.role === 'admin' && (
              <NextLink href={routes.admin} passHref>
                <Link>
                  <MenuItem icon={<FaDatabase />}>Admin</MenuItem>
                </Link>
              </NextLink>
            )}
          </MenuList>
        </Menu>
      )}
    </HStack>
  );
};

export default memo(Header);
