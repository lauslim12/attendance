import { Button, Text, VStack } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { FaRegGrinAlt, FaRegGrinBeam } from 'react-icons/fa';

import type { Status } from '../../../utils/types';
import MFAButton from '../../MFAButton';
import AttendanceModal from '../../Overlay/AttendanceModal';

/**
 * Present component.
 *
 * @param params - Prop.
 * @returns Present component.
 */
const Present = ({ status }: { status: Status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTypeIn, setIsModalTypeIn] = useState(false);

  return (
    <VStack as="section">
      <AttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIn={isModalTypeIn}
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
              setIsModalTypeIn(false);
              setIsModalOpen(true);
            }}
          >
            Check out
          </Button>
        </VStack>
      ) : (
        <VStack>
          <Text>Please authorize yourself before posting your attendance.</Text>
          {status.user && <MFAButton type="blue" user={status.user} />}
        </VStack>
      )}
    </VStack>
  );
};

export default memo(Present);
