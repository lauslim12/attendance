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

import { useStatusAndUser } from '../../../utils/hooks';
import axios from '../../../utils/http';
import routes from '../../../utils/routes';
import TextInput from '../../Input/TextInput';
import { FailedToast, SuccessToast } from '../../Toast';

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

        // Spawn modal.
        SuccessToast(toast, res.message);

        // I really want for this to mutate the SWR first before pushing the router,
        // but apparently SWR is basically too fast so it makes the app render 401
        // and essentially abandons the home router. In order to mitigate this, we reverse
        // the order, so it will be replaced first before mutating the state. There is no
        // memory leak this way, as SWR basically runs in the background.
        router
          .replace(routes.home)
          .then(() =>
            mutate({ isAuthenticated: false, isMFA: false, user: null }, false)
          );
      })
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

      <Grid as="form" w="full" gap={5} onSubmit={updatePassword}>
        <TextInput
          label="Current password"
          placeholder="••••••••••"
          value={currentPassword}
          setValue={setCurrentPassword}
          helper="Your current password"
          type={showPassword ? 'text' : 'password'}
        />

        <TextInput
          label="New password"
          placeholder="••••••••••"
          value={newPassword}
          setValue={setNewPassword}
          helper="Your new password. Minimum is 8 characters"
          type={showPassword ? 'text' : 'password'}
        />

        <TextInput
          label="Confirm new password"
          placeholder="••••••••••"
          value={confirmPassword}
          setValue={setConfirmPassword}
          helper="Confirm your new password"
          type={showPassword ? 'text' : 'password'}
        />

        <Checkbox
          colorScheme="blue"
          alignSelf="start"
          onChange={(e) => setShowPassword(e.target.checked)}
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
