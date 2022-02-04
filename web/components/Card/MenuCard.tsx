import { Icon, Link, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import type { IconType } from 'react-icons';

/**
 * Props for menu.
 */
type Props = {
  header: string;
  description: string;
  icon: IconType;
  gradientStart: string;
  gradientEnd: string;
  gradientAim: string;
  href: string;
};

/**
 * Menu card for admins.
 *
 * @param params - Props.
 * @returns Menu as React functional component.
 */
const MenuCard = ({
  header,
  description,
  icon,
  gradientStart,
  gradientEnd,
  gradientAim,
  href,
}: Props) => (
  <NextLink href={href} passHref>
    <Link _hover={{ textDecoration: 'none' }}>
      <VStack
        bg="twitter.400"
        py={10}
        borderRadius="md"
        justify="center"
        spacing={5}
        bgGradient={`linear(${gradientAim}, ${gradientStart}, ${gradientEnd})`}
        _hover={{
          opacity: 0.7,
          transform: 'scale(1.05)',
          transition: 'all 0.5s ease',
        }}
      >
        <Text fontSize="lg" fontWeight="bold" color="black">
          {header}
        </Text>
        <Text color="black">{description}</Text>
        <Icon as={icon} boxSize="30px" color="black" />
      </VStack>
    </Link>
  </NextLink>
);

export default memo(MenuCard);
