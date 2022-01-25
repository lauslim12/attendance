import { Button, Heading, Text, useToast, VStack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { memo, Suspense, useRef, useState } from 'react';
import { FaBarcode } from 'react-icons/fa';

import axios from '../../utils/http';
import type { Status, User } from '../../utils/types';
import { FailedToast } from '../Toast';

/**
 * Dynamic import overlays.
 */
const OTPModal = dynamic(() => import('../Overlay/OTPModal'), {
  suspense: true,
});
const QRDialog = dynamic(() => import('../Overlay/QRDialog'), {
  suspense: true,
});

/**
 * Box to refresh TOTP secrets.
 *
 * @param parama - Props.
 * @returns React functional component.
 */
const Authenticatorbox = ({ status, user }: { status: Status; user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMFADialogOpen, setIsMFADialogOpen] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [qrCode, setQRCode] = useState('');
  const leastDestructiveRef = useRef(null);
  const toast = useToast();

  const refreshMFA = () => {
    setIsLoading(true);

    axios<{ uri: string }>({
      method: 'PUT',
      url: '/api/v1/auth/update-mfa',
    })
      .then((res) => {
        setIsQRDialogOpen(true);
        setQRCode(res.data.uri);
      })
      .catch((err) => FailedToast(toast, err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <Suspense fallback={null}>
        <QRDialog
          isOpen={isQRDialogOpen}
          leastDestructiveRef={leastDestructiveRef}
          onClose={() => setIsQRDialogOpen(false)}
          code={qrCode}
          name={user.fullName}
        />
      </Suspense>

      <Suspense fallback={null}>
        <OTPModal
          isOpen={isMFADialogOpen}
          onClose={() => setIsMFADialogOpen(false)}
          user={user}
        />
      </Suspense>

      <VStack as="section" p={[2, 10]} spacing={5} mt={10}>
        <Heading as="p" size="lg">
          📱 Authenticator Refresh
        </Heading>
        <Text textAlign="center">
          You may refresh your Authenticator account in your phone by clicking
          below button. You have to be verified by MFA before using this
          feature.
        </Text>

        <Button
          colorScheme="green"
          leftIcon={<FaBarcode />}
          onClick={status.isMFA ? refreshMFA : () => setIsMFADialogOpen(true)}
          isDisabled={isLoading}
          isLoading={isLoading}
        >
          {status.isMFA ? 'Refresh MFA Authentication' : 'Verify OTP'}
        </Button>
      </VStack>
    </>
  );
};

export default memo(Authenticatorbox);
