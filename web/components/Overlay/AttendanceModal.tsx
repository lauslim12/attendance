import {
  Alert,
  AlertIcon,
  Button,
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { memo, useEffect, useState } from 'react';
import { FaBolt, FaCube } from 'react-icons/fa';

import axios from '../../utils/http';
import { SuccessToast } from '../Toast';

/**
 * Props.
 */
type Props = {
  isOpen: boolean;
  onClose: () => void;
  isIn: boolean;
};

/**
 * Showcases the reusable modal for attendance purposes.
 *
 * @param params- Props.
 * @returns React functional component.
 */
const AttendanceModal = ({ isOpen, onClose, isIn }: Props) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const toast = useToast();

  // Reset error and remarks every time it changes props.
  useEffect(() => {
    setError('');
    setRemarks('');
    setIsLoading(false);
  }, [isIn]);

  const report = () => {
    if (remarks.length > 200) {
      setError('You remarks is too long. Max is 200 characters.');
      return;
    }

    const remark = remarks.trim() === '' ? undefined : remarks;
    const data = isIn ? { remarksEnter: remark } : { remarksLeave: remark };

    setIsLoading(true);
    axios({
      method: isIn ? 'POST' : 'PATCH',
      url: `/api/v1/attendance/${isIn ? 'in' : 'out'}`,
      data,
    })
      .then((res) => SuccessToast(toast, res.message))
      .then(onClose)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Attendance</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="stretch" spacing={4}>
            {error.trim() === '' ? (
              <Alert status="info">
                <AlertIcon />
                You are checking {isIn ? 'in' : 'out'} for today.
              </Alert>
            ) : (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <chakra.div>
              <chakra.p>
                (Optional) You can post your thoughts in below text area.
              </chakra.p>
              <chakra.p as="strong" fontWeight="700">
                This action cannot be undone.
              </chakra.p>
            </chakra.div>

            <Textarea
              placeholder="You can write up to 200 characters. This is optional."
              value={remarks}
              onChange={({ currentTarget: { value } }) => setRemarks(value)}
              h="25vh"
              fontSize="sm"
            />

            <Text>
              After you are done, click the button to post your attendance.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>

          {isIn ? (
            <Button
              leftIcon={<FaCube />}
              colorScheme="green"
              isDisabled={isLoading}
              isLoading={isLoading}
              onClick={report}
            >
              Check In
            </Button>
          ) : (
            <Button
              leftIcon={<FaBolt />}
              colorScheme="purple"
              isDisabled={isLoading}
              isLoading={isLoading}
              onClick={report}
            >
              Check Out
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(AttendanceModal);
