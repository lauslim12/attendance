import { Badge, Heading, useColorModeValue, VStack } from '@chakra-ui/react';
import { memo } from 'react';

import type { User } from '../../../utils/types';

/**
 * Top part of the Profile page.
 *
 * @param params - Props.
 * @returns React functional component.
 */
const Topbox = ({ user }: { user: User }) => (
  <VStack
    as="header"
    bg={useColorModeValue('rgb(160, 174, 192, .4)', 'rgb(74, 85, 104, .4)')}
    py={7}
    rounded="md"
    spacing={3}
  >
    <Heading as="h1" size="lg">
      {user.fullName}
    </Heading>

    <Heading as="h2" size="sm">
      {user.email}
    </Heading>

    <Heading as="h3" size="sm">
      {user.phoneNumber}
    </Heading>

    {user.role === 'admin' ? (
      <Badge colorScheme="green">{user.role}</Badge>
    ) : (
      <Badge colorScheme="blue">{user.role}</Badge>
    )}
  </VStack>
);

export default memo(Topbox);
