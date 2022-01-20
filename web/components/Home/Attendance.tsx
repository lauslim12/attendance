import {
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';
import { FaRegGrinAlt, FaRegGrinBeam } from 'react-icons/fa';

import useRequest from '../../hooks/useRequest';
import type { User } from '../../types/User';

/**
 * Attendance component to provide checking-in and checking-out functionalities.
 *
 * @returns React functional component.
 */
const Attendance = () => {
  const { data: user } = useRequest<User>('/api/v1/users/me');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerUpdate = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(timerUpdate);
  }, []);

  return (
    <VStack w="full" align="center" spacing={3}>
      {user && <Text fontSize="lg">Welcome back, {user.fullName}!</Text>}

      <Heading
        as="h1"
        bgGradient={useColorModeValue(
          'linear(to-r, #00baff, #00baff, #063ef9)',
          'linear(to-r, #945bf1, #bb48bf, #bb48bf, #f67e4d)'
        )}
        bgClip="text"
        fontSize={['3xl', '5xl', '7xl']}
        fontWeight="extrabold"
        letterSpacing={10}
        mb={5}
      >
        {time.toLocaleDateString('en-GB')}
      </Heading>

      <Heading
        as="h2"
        bgGradient={useColorModeValue(
          'linear(to-r, #00baff, #00baff, #063ef9)',
          'linear(to-r, #945bf1, #bb48bf, #bb48bf, #f67e4d)'
        )}
        bgClip="text"
        fontSize={['3xl', '4xl', '6xl']}
        fontWeight="extrabold"
        letterSpacing={10}
        mb={5}
      >
        {time.toLocaleTimeString('en-GB')}
      </Heading>

      <VStack
        align="stretch"
        spacing={3}
        textAlign={['center', 'left']}
        fontSize="sm"
      >
        <Text>
          Check in and check out your attendance by clicking these buttons. You
          will be asked for an OTP for MFA if you have not yet already.
        </Text>

        <Button
          colorScheme="green"
          leftIcon={<FaRegGrinAlt />}
          variant="outline"
          isFullWidth
        >
          Check in
        </Button>

        <Button
          colorScheme="purple"
          leftIcon={<FaRegGrinBeam />}
          variant="outline"
          isFullWidth
        >
          Check out
        </Button>
      </VStack>
    </VStack>
  );
};

export default memo(Attendance);
