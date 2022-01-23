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
import { memo, useEffect, useState } from 'react';
import { FaGoogle, FaMagic, FaMailBulk, FaSms, FaTimes } from 'react-icons/fa';

import useRequest from '../hooks/useRequest';
import type { Status } from '../types/Auth';
import type Response from '../types/Response';
import type { User } from '../types/User';
import axios from '../utils/http';
import { SuccessToast } from './Toast';

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
  const { mutate: mutateStatus } = useRequest<Status>('/api/v1/auth/status');
  const [counter, setCounter] = useState(0);
  const [flash, setFlash] = useState({ type: 'sucess', message: '' });
  const [isOTPError, setIsOTPError] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);
  const [otp, setOTP] = useState('');
  const [sendingOTP, setSendingOTP] = useState(false);
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
    setIsOTPError(false);
    setSendingOTP(true);

    axios<Response<unknown>>({
      method: 'POST',
      url: `/api/v1/auth/otp?media=${media}`,
    })
      .then((res) => setFlash({ type: 'success', message: res.message }))
      .catch((err) => setFlash({ type: 'error', message: err.message }))
      .finally(() => {
        setCounter(30);
        setSendingOTP(false);
      });
  };

  // Verifies an OTP.
  const verifyOTP = (otp: string) => {
    setIsVerifyLoading(true);

    axios<Response<unknown>>({
      method: 'PUT',
      url: '/api/v1/auth/otp',
      auth: { username: user.userID, password: otp },
    })
      .then((res) => {
        // Show feedback.
        SuccessToast(toast, res.message);

        // Reset all states.
        setFlash({ type: 'success', message: '' });
        setIsVerifyLoading(false);
        setIsOTPError(false);

        // Mutate the data without revalidation.
        mutateStatus({ isAuthenticated: true, isMFA: true }, false);
      })
      .then(onClose)
      .catch((err) => {
        setFlash({ type: 'error', message: err.message });
        setIsVerifyLoading(false);
        setIsOTPError(true);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
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

            <Text fontWeight="bold">Please input your OTP or request one!</Text>

            <HStack>
              <PinInput
                value={otp}
                onChange={(otp: string) => setOTP(otp)}
                onComplete={(otp: string) => verifyOTP(otp)}
                isDisabled={isVerifyLoading || sendingOTP}
                isInvalid={isOTPError}
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
              Please keep in mind that OTPs are integers only and are only valid
              for 30 seconds. Remember to not share your OTPs with anyone. We
              will never ask for your OTP.
            </Text>

            <Stack direction={['column', 'row']}>
              <Button
                colorScheme="blue"
                size="sm"
                leftIcon={<FaMailBulk />}
                isDisabled={counter !== 0 || isVerifyLoading || sendingOTP}
                onClick={() => sendOTP('email')}
              >
                Send OTP (Email)
              </Button>

              <Button
                colorScheme="purple"
                size="sm"
                leftIcon={<FaSms />}
                isDisabled={counter !== 0 || isVerifyLoading || sendingOTP}
                onClick={() => sendOTP('sms')}
              >
                Send OTP (Phone)
              </Button>

              <Button
                colorScheme="orange"
                size="sm"
                leftIcon={<FaGoogle />}
                isDisabled={counter !== 0 || isVerifyLoading || sendingOTP}
                onClick={() => sendOTP('authenticator')}
              >
                Send OTP (Authenticator)
              </Button>
            </Stack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            leftIcon={<FaTimes />}
            variant="ghost"
            size="sm"
            colorScheme="blue"
            mr={3}
            onClick={onClose}
          >
            Close
          </Button>

          <Button
            leftIcon={<FaMagic />}
            size="sm"
            colorScheme="green"
            onClick={() => verifyOTP(otp)}
            isDisabled={isVerifyLoading || sendingOTP}
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
