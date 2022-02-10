import {
  Badge,
  Button,
  HStack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { memo, useState } from 'react';

import { useUsers } from '../../utils/hooks';
import axios from '../../utils/http';
import type { User } from '../../utils/types';
import { FailedToast, SuccessToast } from '../Toast';

/**
 * Dynamic imports.
 */
const AlertOverlay = dynamic(() => import('../Overlay/AlertOverlay'));
const EditUserModal = dynamic(() => import('../Overlay/EditUserModal'));

/**
 * Props.
 */
type Props = {
  user: User;
};

/**
 * Card that is filled with User data.
 *
 * @param params - Props.
 * @returns User card component as React functional component.
 */
const UserCard = ({ user }: Props) => {
  const { mutate } = useUsers();
  const [isOpenDeactivate, setIsOpenDeactivate] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenReactivate, setIsOpenReactivate] = useState(false);
  const toast = useToast();

  const deactivateUser = () => {
    axios({
      method: 'PATCH',
      url: `/api/v1/users/${user.userID}`,
      data: { isActive: false },
    })
      .then(() => SuccessToast(toast, 'Successfully deactivated user.'))
      .catch((err) => FailedToast(toast, err.message))
      .finally(() => {
        setIsOpenDeactivate(false);
        mutate();
      });
  };

  const reactivateUser = () => {
    axios({
      method: 'PATCH',
      url: `/api/v1/users/${user.userID}`,
      data: { isActive: true },
    })
      .then(() => SuccessToast(toast, 'Successfully reactivated user.'))
      .catch((err) => FailedToast(toast, err.message))
      .finally(() => {
        setIsOpenReactivate(false);
        mutate();
      });
  };

  return (
    <>
      <AlertOverlay
        isOpen={isOpenDeactivate}
        setIsOpen={setIsOpenDeactivate}
        title="Deactivate User"
        description={`Are you sure to deactivate the user ${user.fullName}?`}
        fn={deactivateUser}
      />

      <AlertOverlay
        isOpen={isOpenReactivate}
        setIsOpen={setIsOpenReactivate}
        title="Reactivate User"
        description={`Are you sure to reactivate the user ${user.fullName}?`}
        fn={reactivateUser}
      />

      <EditUserModal
        isOpen={isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
        user={user}
      />

      <VStack
        as="article"
        align="stretch"
        p={4}
        borderRadius="md"
        bg={useColorModeValue('white', 'gray.900')}
        borderWidth={1}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        transition=".2s"
      >
        <VStack spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            {user.fullName}
          </Text>
          <Text fontSize="xs">{`@${user.email.split('@')[1]}`}</Text>
          <Text fontSize="xs">{user.phoneNumber}</Text>
        </VStack>

        <VStack spacing={1} fontSize="xs">
          <Text fontWeight="bold">Role/Status:</Text>
          <HStack>
            <Badge colorScheme={user.role === 'admin' ? 'green' : 'blue'}>
              {user.role}
            </Badge>

            <Badge colorScheme={user.isActive ? 'orange' : 'red'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </HStack>
        </VStack>

        <VStack fontSize="xs" w="full">
          <Text fontWeight="bold">Actions:</Text>
          <Button
            size="xs"
            colorScheme="linkedin"
            w="full"
            onClick={() => setIsOpenEdit(true)}
          >
            Edit
          </Button>

          {user.isActive ? (
            <Button
              size="xs"
              colorScheme="red"
              w="full"
              onClick={() => setIsOpenDeactivate(true)}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="xs"
              colorScheme="purple"
              w="full"
              onClick={() => setIsOpenReactivate(true)}
            >
              Reactivate
            </Button>
          )}
        </VStack>
      </VStack>
    </>
  );
};

export default memo(UserCard);
