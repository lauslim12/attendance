import {
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';
import { FaKey, FaRegGrinAlt, FaRegGrinBeam } from 'react-icons/fa';

import useRequest from '../../hooks/useRequest';
import type { Status } from '../../types/Auth';
import type { User } from '../../types/User';
import AttendanceModal from '../AttendanceModal';
import OTPModal from '../OTPModal';

/**
 * Attendance component to provide checking-in and checking-out functionalities.
 *
 * @returns React functional component.
 */
const Attendance = ({ status }: { status: Status }) => {
  const { data: user } = useRequest<User>('/api/v1/users/me');
  const [attendModalOpen, setAttendModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalTypeIn, setIsModalTypeIn] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerUpdate = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(timerUpdate);
  }, []);

  return (
    <>
      {user && (
        <OTPModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          user={user}
        />
      )}

      {user && (
        <AttendanceModal
          isOpen={attendModalOpen}
          onClose={() => setAttendModalOpen(false)}
          isIn={isModalTypeIn}
        />
      )}

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

        <VStack align="stretch" spacing={3} textAlign="center" fontSize="sm">
          <Text>
            {status.isAuthenticated
              ? 'You are currently authenticated.'
              : 'You are currently not authenticated.'}
          </Text>

          <Text>
            {status.isMFA
              ? 'You are currently authorized by MFA.'
              : 'You are currently not authorized by MFA.'}
          </Text>

          {status.isMFA ? (
            <>
              <Text>
                Check in and check out your attendance by clicking these
                buttons.
              </Text>

              <Button
                colorScheme="green"
                leftIcon={<FaRegGrinAlt />}
                variant="outline"
                isFullWidth
                onClick={() => {
                  setIsModalTypeIn(true);
                  setAttendModalOpen(true);
                }}
              >
                Check in
              </Button>

              <Button
                colorScheme="purple"
                leftIcon={<FaRegGrinBeam />}
                variant="outline"
                isFullWidth
                onClick={() => {
                  setIsModalTypeIn(false);
                  setAttendModalOpen(true);
                }}
              >
                Check out
              </Button>
            </>
          ) : (
            <>
              <Text>
                Please authorize yourself by OTP before posting your attendance.
              </Text>

              <Button
                leftIcon={<FaKey />}
                colorScheme="twitter"
                onClick={() => setIsOpen(true)}
              >
                Authorize yourself with MFA (OTP)
              </Button>
            </>
          )}
        </VStack>
      </VStack>
    </>
  );
};

export default memo(Attendance);
