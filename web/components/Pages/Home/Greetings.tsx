import { Text } from '@chakra-ui/react';
import { memo } from 'react';

/**
 * Greetings component.
 *
 * @param params - Full name as prop.
 * @returns Greetings component.
 */
const Greetings = ({ fullName }: { fullName: string }) => (
  <Text fontSize="lg" textAlign="center" fontWeight="bold">
    Welcome back, {fullName}!
  </Text>
);

export default memo(Greetings);
