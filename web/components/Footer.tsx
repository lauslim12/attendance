import { HStack, IconButton, Link, Spacer } from '@chakra-ui/react';
import { memo } from 'react';
import { FaGithub } from 'react-icons/fa';

/**
 * The whole part of the Footer in the web application.
 *
 * @returns React functional component.
 */
const Footer = () => (
  <HStack as="footer" p={4} spacing={2} fontSize="xs">
    <Link
      href="https://www.nicholasdw.com"
      _hover={{ textDecor: 'none', color: 'orange.400' }}
      isExternal
    >
      &copy; {new Date().getFullYear()} - Nicholas
    </Link>

    <Spacer />

    <Link href="https://github.com/lauslim12/attendance" isExternal>
      <IconButton
        aria-label="Access repository"
        icon={<FaGithub />}
        variant="ghost"
      />
    </Link>
  </HStack>
);

export default memo(Footer);
