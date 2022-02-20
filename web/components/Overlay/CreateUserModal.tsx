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
import { memo, useRef, useState } from 'react';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';

import { useUsers } from '../../utils/hooks';
import axios from '../../utils/http';
import type { User } from '../../utils/types';
import SelectInput from '../Input/SelectInput';
import TextInput from '../Input/TextInput';
import { FailedToast, SuccessToast } from '../Toast';
import QRDialog from './QRDialog';

/**
 * Props.
 */
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Spawns a modal to create a user.
 *
 * @param params - Props.
 * @returns Edit modal functional component.
 */
const CreateUserModal = ({ isOpen, onClose }: Props) => {
  const { mutate: setUsers } = useUsers();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');

  // Reactive component.
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const cancelRef = useRef(null);
  const toast = useToast();

  // Create a user.
  const createUser = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    axios<User & { uri: string }>({
      method: 'POST',
      url: `/api/v1/users`,
      data: { email, fullName, phoneNumber, role, username, password },
    })
      .then((res) => {
        SuccessToast(toast, res.message);
        setOpenQRDialog(true);
        setCode(res.data.uri);
      })
      .catch((err) => FailedToast(toast, err.message))
      .finally(() => {
        setUsers();
        setIsLoading(false);
        onClose();
      });
  };

  return (
    <>
      <QRDialog
        isOpen={openQRDialog}
        leastDestructiveRef={cancelRef}
        onClose={() => setOpenQRDialog(false)}
        code={code}
        name={fullName}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack as="form" align="stretch" onSubmit={createUser}>
              <Alert status="success" variant="left-accent">
                <AlertIcon />
                Create a user here!
              </Alert>

              <TextInput
                label="Username"
                placeholder="john.smith"
                value={username}
                setValue={setUsername}
                helper="The username to be used."
                type="text"
              />

              <TextInput
                label="Full name"
                placeholder="John Smith"
                value={fullName}
                setValue={setFullName}
                helper="The full name to be used."
                type="text"
              />

              <TextInput
                label="Email"
                placeholder="john.smith@gmail.com"
                value={email}
                setValue={setEmail}
                helper="The email to be used."
                type="email"
              />

              <TextInput
                label="Phone number"
                placeholder="081219204571"
                value={phoneNumber}
                setValue={setPhoneNumber}
                helper="The phone number to be used in Indonesian format (with or without +62)."
                type="tel"
              />

              <TextInput
                label="Password"
                placeholder="••••••••••"
                value={password}
                setValue={setPassword}
                helper="Password of this user"
                type="password"
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
              onClick={createUser}
              disabled={
                email.trim() === '' ||
                fullName.trim() === '' ||
                phoneNumber.trim() === '' ||
                role.trim() === '' ||
                password.trim() === '' ||
                username.trim() === '' ||
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
    </>
  );
};

export default memo(CreateUserModal);
