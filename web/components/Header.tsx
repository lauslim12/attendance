import {
  Heading,
  HStack,
  IconButton,
  Link,
  Spacer,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaMoon } from 'react-icons/fa';

import routes from '../utils/routes';

/**
 * Header of the whole application.
 *
 * @returns React Functional Component.
 */
const Header = () => {
  const { toggleColorMode } = useColorMode();

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

      <p>About</p>

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
