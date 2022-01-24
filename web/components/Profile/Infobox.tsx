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

import { useStatusAndUser } from '../../utils/hooks';
import axios from '../../utils/http';
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
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
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

  return (
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

      <Button
        colorScheme="yellow"
        leftIcon={<FaPencilRuler />}
        onClick={editProfile}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Edit My Profile
      </Button>
    </VStack>
  );
};

export default memo(Infobox);
