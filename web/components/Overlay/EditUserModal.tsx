import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  VStack,
} from '@chakra-ui/react';
import type { FormEvent } from 'react';
import { memo, useState } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';

import { useStatusAndUser, useUsers } from '../../utils/hooks';
import axios from '../../utils/http';
import type { User } from '../../utils/types';
import EmailInput from '../Input/EmailInput';
import PhoneInput from '../Input/PhoneInput';
import SelectInput from '../Input/SelectInput';
import TextInput from '../Input/TextInput';
import { FailedToast, SuccessToast } from '../Toast';

/**
 * Props.
 */
type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

/**
 * Spawns a modal to edit a user.
 *
 * @param params - Props.
 * @returns Edit modal functional component.
 */
const EditUserModal = ({ isOpen, onClose, user }: Props) => {
  const { mutate: setUsers } = useUsers();
  const { mutate: setStatus } = useStatusAndUser();
  const [email, setEmail] = useState(user.email);
  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [role, setRole] = useState(user.role as string);

  // Reactive component.
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Edit a user.
  const editUser = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    axios({
      method: 'PATCH',
      url: `/api/v1/users/${user.userID}`,
      data: { email, fullName, phoneNumber, role },
    })
      .then((res) => SuccessToast(toast, res.message))
      .catch((err) => FailedToast(toast, err.message))
      .finally(() => {
        setUsers();
        setStatus();
        setIsLoading(false);
        onClose();
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack as="form" align="stretch" onSubmit={editUser}>
            <Alert status="success" variant="left-accent">
              <AlertIcon />
              Edit a user here!
            </Alert>

            <TextInput
              label="Full name"
              placeholder="John Smith"
              value={fullName}
              setValue={setFullName}
              helper="The full name to be used."
            />

            <EmailInput
              label="Email"
              placeholder="john.smith@gmail.com"
              value={email}
              setValue={setEmail}
              helper="The email to be used."
            />

            <PhoneInput
              label="Phone number"
              placeholder="+62-890-1122-3344"
              value={phoneNumber}
              setValue={setPhoneNumber}
              helper="The phone number to be used."
            />

            <SelectInput
              label="Role"
              value={role}
              setValue={setRole}
              options={['admin', 'user']}
              helper="Role of this user"
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            leftIcon={<FaPencilAlt />}
            colorScheme="green"
            mr={3}
            isLoading={isLoading}
            onClick={editUser}
            disabled={
              email.trim() === '' ||
              fullName.trim() === '' ||
              phoneNumber.trim() === '' ||
              role.trim() === '' ||
              isLoading
            }
          >
            Submit
          </Button>
          <Button leftIcon={<FaTimes />} colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(EditUserModal);
