import { Button, Text, useToast, VStack } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { FaRegGrinAlt, FaRegGrinBeam } from 'react-icons/fa';

import { useAttendanceStatus } from '../../../utils/hooks';
import type { Status } from '../../../utils/types';
import MFAButton from '../../MFAButton';
import AttendanceModal from '../../Overlay/AttendanceModal';
import { FailedToast } from '../../Toast';

/**
 * Present component.
 *
 * @param params - Prop.
 * @returns Present component.
 */
const Present = ({ status }: { status: Status }) => {
  const { attendanceStatus, mutate } = useAttendanceStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTypeIn, setIsModalTypeIn] = useState(false);
  const toast = useToast();

  return (
    <VStack as="section">
      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIn={isModalTypeIn}
        setAttendanceStatus={mutate}
      />

      {status.isMFA ? (
        <VStack>
          <Text textAlign={['center', 'left']}>
            Check in and check out your attendance by clicking these buttons.
          </Text>

          <Button
            colorScheme="green"
            leftIcon={<FaRegGrinAlt />}
            variant="outline"
            isFullWidth
            onClick={() => {
              if (attendanceStatus?.hasCheckedIn) {
                FailedToast(toast, 'You have checked in for today!');
                return;
              }

              setIsModalTypeIn(true);
              setIsModalOpen(true);
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
              if (attendanceStatus?.hasCheckedOut) {
                FailedToast(toast, 'You have checked out for today!');
                return;
              }

              setIsModalTypeIn(false);
              setIsModalOpen(true);
            }}
          >
            Check out
          </Button>
        </VStack>
      ) : (
        <VStack>
          <Text textAlign={['center', 'left']}>
            Please authorize yourself before posting your attendance.
          </Text>
          {status.user && <MFAButton type="blue" user={status.user} />}
        </VStack>
      )}
    </VStack>
  );
};

export default memo(Present);
