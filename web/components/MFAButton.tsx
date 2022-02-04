import { Button } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { memo, useState } from 'react';
import { FaBarcode, FaKey } from 'react-icons/fa';

import type { User } from '../utils/types';

/**
 * Dynamic import.
 */
const OTPModal = dynamic(() => import('./Overlay/OTPModal'));

/**
 * Returns an MFA button complete with the OTP modal.
 *
 * @param params - Props.
 * @returns MFA button.
 */
const MFAButton = ({ type, user }: { type: 'green' | 'blue'; user: User }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <OTPModal isOpen={isOpen} onClose={() => setIsOpen(false)} user={user} />

      {type === 'green' ? (
        <Button
          colorScheme="green"
          leftIcon={<FaBarcode />}
          onClick={() => setIsOpen(true)}
        >
          Two Factor Authentication
        </Button>
      ) : (
        <Button
          leftIcon={<FaKey />}
          colorScheme="twitter"
          onClick={() => setIsOpen(true)}
        >
          Two Factor Authentication
        </Button>
      )}
    </>
  );
};

export default memo(MFAButton);
