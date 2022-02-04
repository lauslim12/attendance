import { Badge, VStack } from '@chakra-ui/react';
import { memo } from 'react';

import type { Status } from '../../../utils/types';

/**
 * Current Status component.
 *
 * @param params - Status prop.
 * @returns Current status component.
 */
const CurrentStatus = ({ status }: { status: Status }) => (
  <VStack as="section">
    <Badge colorScheme="purple">Authenticated by Session</Badge>

    {status.isMFA ? (
      <Badge colorScheme="green">Authenticated by MFA</Badge>
    ) : (
      <Badge colorScheme="red">Not authenticated by MFA</Badge>
    )}
  </VStack>
);

export default memo(CurrentStatus);
