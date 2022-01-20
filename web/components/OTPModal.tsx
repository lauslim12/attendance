import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { memo, useCallback, useEffect, useState } from 'react';

import type Response from '../types/Response';
import type { User } from '../types/User';
import axios from '../utils/http';

/**
 * Accepts ChakraUI's basic props: 'isOpen' and 'onClose'.
 */
type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

/**
 * OTP Modal to show and verify the OTP.
 *
 * @param params - Options objects for this modal.
 * @returns React functional component.
 */
const OTPModal = ({ isOpen, onClose, user }: Props) => {
  const [counter, setCounter] = useState(0);
  const [flash, setFlash] = useState({ type: 'sucess', message: '' });
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [otp, setOTP] = useState('');
  const toast = useToast();

  // Allow to perform timer-esque stuff in this component.
  useEffect(() => {
    const ctrUpdate = setInterval(() => {
      if (counter === 0) {
        clearInterval(ctrUpdate);
        return;
      }

      setCounter((ctr) => ctr - 1);
    }, 1000);

    return () => clearInterval(ctrUpdate);
  }, [counter]);

  // Sends an OTP.
  const sendOTP = (media: 'sms' | 'authenticator' | 'email') => {
    axios<Response<unknown>>({
      method: 'POST',
      url: `/api/v1/auth/otp?media=${media}`,
    })
      .then((res) => setFlash({ type: 'success', message: res.message }))
      .catch((err) => setFlash({ type: 'error', message: err.message }))
      .finally(() => setCounter(30));
  };

  // Verifies an OTP.
  const verifyOTP = useCallback(() => {
    setIsVerifyLoading(true);

    axios<Response<unknown>>({
      method: 'PUT',
      url: '/api/v1/auth/otp',
      auth: { username: user.userID, password: otp },
    })
      .then((res) => {
        toast({
          title: 'Success!',
          description: res.message,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        setFlash({ type: 'success', message: '' });
        setIsVerifyLoading(false);
        onClose();
      })
      .catch((err) => {
        setFlash({ type: 'error', message: err.message });
        setIsVerifyLoading(false);
      });
  }, [otp, toast, user.userID, onClose]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOTP();
    }
  }, [otp, verifyOTP]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader fontSize="lg">Multi-Factor Authentication</ModalHeader>

        <ModalBody>
          <VStack as="form" fontSize="sm" spacing={4}>
            <Alert
              status={counter === 0 ? 'success' : 'info'}
              variant="left-accent"
            >
              <AlertIcon />
              <AlertDescription>
                {counter === 0
                  ? `You may ask for an OTP!`
                  : `You may ask for OTP again in ${counter} seconds!`}
              </AlertDescription>
            </Alert>

            {flash.message.trim() !== '' && (
              <Alert
                status={flash.type as 'success' | 'error'}
                variant="left-accent"
              >
                <AlertIcon />
                <AlertDescription>{flash.message}</AlertDescription>
              </Alert>
            )}

            <Text>Please input your OTP or request one!</Text>

            <HStack>
              <PinInput
                value={otp}
                onChange={(otp: string) => setOTP(otp)}
                isDisabled={isVerifyLoading}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>

            <Text>
              Please keep in mind that OTPs are integers only. Remember to not
              share your OTPs with anyone. We will never ask for your OTP.
            </Text>

            <Stack direction={['column', 'row']}>
              <Button
                size="sm"
                isDisabled={counter !== 0 || isVerifyLoading}
                onClick={() => sendOTP('email')}
              >
                Send OTP (Email)
              </Button>

              <Button
                size="sm"
                isDisabled={counter !== 0 || isVerifyLoading}
                onClick={() => sendOTP('sms')}
              >
                Send OTP (Phone)
              </Button>

              <Button
                size="sm"
                isDisabled={counter !== 0 || isVerifyLoading}
                onClick={() => sendOTP('authenticator')}
              >
                Send OTP (Authenticator)
              </Button>
            </Stack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>

          <Button
            variant="ghost"
            onClick={verifyOTP}
            isDisabled={isVerifyLoading}
            isLoading={isVerifyLoading}
          >
            Verify
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(OTPModal);
