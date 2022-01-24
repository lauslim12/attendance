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
import { api } from '../../utils/http';
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
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const updatePassword = () => {
    api({
      method: 'PATCH',
      url: '/api/v1/auth/update-password',
      data: { currentPassword, newPassword, confirmPassword },
    })
      .then((res) => {
        // Mutate session and force user to log out.
        mutate({ isAuthenticated: false, isMFA: false, user: null }, false);

        // Spawn modal.
        SuccessToast(toast, res.message);

        // Force redirect to 'Home'.
        router.replace(routes.home);
      })
      .catch((err) => FailedToast(toast, err.message));
  };

  return (
    <VStack p={[2, 10]} spacing={5} mt={10}>
      <Heading size="lg">🔑 Update Password</Heading>
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
      >
        Update Password
      </Button>
    </VStack>
  );
};

export default memo(Passwordbox);
