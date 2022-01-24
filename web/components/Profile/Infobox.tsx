import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Grid,
  Heading,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo, useRef, useState } from 'react';
import { FaEraser, FaFire, FaPencilRuler } from 'react-icons/fa';

import { useStatusAndUser } from '../../utils/hooks';
import axios from '../../utils/http';
import routes from '../../utils/routes';
import type { Status, User } from '../../utils/types';
import TextInput from '../Input/TextInput';
import { FailedToast, SuccessToast } from '../Toast';

/**
 * Edit profile box to edit non-sensitive information.
 *
 * @param params - Props.
 * @returns React functional component.
 */
const Infobox = ({ status, user }: { status: Status; user: User }) => {
  const { mutate } = useStatusAndUser();
  const [email, setEmail] = useState(user.email);
  const [fullName, setFullName] = useState(user.fullName);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const editProfile = () => {
    setIsLoading(true);

    axios<User>({
      method: 'PATCH',
      url: '/api/v1/users/me',
      data: { email, fullName, phoneNumber },
    })
      .then((res) => {
        // Mutate according to the results.
        mutate({ ...status, user: res.data }, false);

        // Send back toast.
        SuccessToast(toast, res.message);
      })
      .catch((err) => FailedToast(toast, err.message))
      .finally(() => setIsLoading(false));
  };

  const deleteProfile = () => {
    setIsLoading(true);

    axios({ method: 'DELETE', url: '/api/v1/users/me' })
      .then(() => {
        // Set not loading.
        setIsLoading(false);
        setIsOpen(false);

        // Mutate.
        mutate({ isAuthenticated: false, isMFA: false, user: null }, false);

        // Send back toast.
        SuccessToast(toast, 'Successfully deleted the user.');

        // Redirect to homepage.
        router.replace(routes.home);
      })
      .catch((err) => {
        setIsLoading(false);
        FailedToast(toast, err.message);
      });
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This is a potentially destructive and irreversible
              action.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button
                colorScheme="red"
                leftIcon={<FaFire />}
                onClick={deleteProfile}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <VStack as="section" p={[2, 10]} spacing={5} mt={10}>
        <Heading as="p" size="lg">
          ✍️ Edit Profile
        </Heading>
        <Text textAlign="center">
          You may edit your profile by changing below values.
        </Text>

        <Grid
          as="form"
          w="full"
          templateColumns={{ lg: 'repeat(2, 1fr)' }}
          gap={[5, 10]}
        >
          <TextInput
            label="Full name"
            placeholder="Your full name"
            value={fullName}
            setValue={setFullName}
            helper="Your full name for this website"
          />

          <TextInput
            label="Email"
            placeholder="Your email"
            value={email}
            setValue={setEmail}
            helper="Your email to receive OTPs"
          />

          <TextInput
            label="Phone Number"
            placeholder="Your phone number"
            value={phoneNumber}
            setValue={setPhoneNumber}
            helper="Your phone number to receive OTPs"
          />
        </Grid>

        <Stack direction={['column', 'row']} spacing={4}>
          <Button
            colorScheme="yellow"
            leftIcon={<FaPencilRuler />}
            onClick={editProfile}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Edit My Profile
          </Button>

          <Button
            colorScheme="red"
            leftIcon={<FaEraser />}
            onClick={() => setIsOpen(true)}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            Delete My Profile
          </Button>
        </Stack>
      </VStack>
    </>
  );
};

export default memo(Infobox);
