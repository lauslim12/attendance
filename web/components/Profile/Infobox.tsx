import {
  Button,
  Grid,
  Heading,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { memo, useState } from 'react';
import { FaPencilRuler } from 'react-icons/fa';

import type { Status } from '../../types/Auth';
import type { User } from '../../types/User';
import { useStatusAndUser } from '../../utils/hooks';
import { api } from '../../utils/http';
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
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const toast = useToast();

  const editProfile = () => {
    api<User>({
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
      .catch((err) => FailedToast(toast, err.message));
  };

  return (
    <VStack p={[2, 10]} spacing={5} mt={10}>
      <Heading size="lg">✍️ Edit Profile</Heading>
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

      <Button
        colorScheme="yellow"
        leftIcon={<FaPencilRuler />}
        onClick={editProfile}
      >
        Edit My Profile
      </Button>
    </VStack>
  );
};

export default memo(Infobox);
