import { Button, Text, VStack } from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';
import { FaRegGrinAlt, FaRegGrinBeam } from 'react-icons/fa';

import type { Status } from '../../utils/types';
import MainHeading from '../MainHeading';
import MFAButton from '../MFAButton';
import AttendanceModal from '../Overlay/AttendanceModal';

/**
 * Attendance component to provide checking-in and checking-out functionalities.
 *
 * @returns React functional component.
 */
const Attendance = ({ status }: { status: Status }) => {
  const [attendModalOpen, setAttendModalOpen] = useState(false);
  const [isModalTypeIn, setIsModalTypeIn] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerUpdate = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(timerUpdate);
  }, []);

  return (
    <>
      {status.user && (
        <AttendanceModal
          isOpen={attendModalOpen}
          onClose={() => setAttendModalOpen(false)}
          isIn={isModalTypeIn}
        />
      )}

      <VStack w="full" align="center" spacing={3}>
        {status.user && (
          <Text fontSize="lg">Welcome back, {status.user.fullName}!</Text>
        )}

        <MainHeading
          text={time.toLocaleDateString('en-GB')}
          as="h2"
          fontSize={['3xl', '5xl', '7xl']}
          letterSpacing={10}
          mb={5}
        />

        <MainHeading
          text={time.toLocaleTimeString('en-GB')}
          as="h3"
          fontSize={['3xl', '4xl', '6xl']}
          letterSpacing={10}
          mb={5}
        />

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
                Please authorize yourself before posting your attendance.
              </Text>

              {status.user && <MFAButton type="blue" user={status.user} />}
            </>
          )}
        </VStack>
      </VStack>
    </>
  );
};

export default memo(Attendance);
