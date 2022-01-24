import {
  Button,
  Checkbox,
  Grid,
  Heading,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo, useState } from 'react';
import { FaPassport } from 'react-icons/fa';

import { useStatusAndUser } from '../../utils/hooks';
import axios from '../../utils/http';
import routes from '../../utils/routes';
import TextInput from '../Input/TextInput';
import { FailedToast, SuccessToast } from '../Toast';

/**
 * Password box to edit password.
 *
 * @returns React functional component.
 */
const Passwordbox = () => {
  const { mutate } = useStatusAndUser();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const updatePassword = () => {
    setIsLoading(true);

    axios({
      method: 'PATCH',
      url: '/api/v1/auth/update-password',
      data: { currentPassword, newPassword, confirmPassword },
    })
      .then((res) => {
        // Set is loading to false.
        setIsLoading(false);

        // Mutate session and force user to log out.
        mutate({ isAuthenticated: false, isMFA: false, user: null }, false);

        // Spawn modal.
        SuccessToast(toast, res.message);
      })
      .then(() => router.replace(routes.login))
      .catch((err) => {
        FailedToast(toast, err.message);
        setIsLoading(false);
      });
  };

  return (
    <VStack as="section" p={[2, 10]} spacing={5} mt={10}>
      <Heading as="p" size="lg">
        🔑 Update Password
      </Heading>
      <Text textAlign="center">
        You may edit your authentication data by changing below values.
      </Text>

      <Grid as="form" w="full" gap={5}>
        <TextInput
          label="Current password"
          placeholder="••••••••••"
          value={currentPassword}
          setValue={setCurrentPassword}
          helper="Your current password"
          isPassword={!showPassword}
        />

        <TextInput
          label="New password"
          placeholder="••••••••••"
          value={newPassword}
          setValue={setNewPassword}
          helper="Your new password"
          isPassword={!showPassword}
        />

        <TextInput
          label="Confirm new password"
          placeholder="••••••••••"
          value={confirmPassword}
          setValue={setConfirmPassword}
          helper="Confirm your new password"
          isPassword={!showPassword}
        />

        <Checkbox
          colorScheme="blue"
          alignSelf="start"
          onChange={() => setShowPassword(!showPassword)}
          isChecked={showPassword}
        >
          <Text fontSize="sm">Show password</Text>
        </Checkbox>
      </Grid>

      <Button
        colorScheme="facebook"
        leftIcon={<FaPassport />}
        onClick={updatePassword}
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Update Password
      </Button>
    </VStack>
  );
};

export default memo(Passwordbox);
