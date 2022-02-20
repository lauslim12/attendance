import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Checkbox,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { memo, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import axios from '../../../utils/http';
import routes from '../../../utils/routes';
import TextInput from '../../Input/TextInput';
import { SuccessToast } from '../../Toast';

/**
 * Renders a form to reset the user's password.
 *
 * @param params - Props.
 * @returns React functional component.
 */
const ResetPasswordForm = ({ token }: { token: string }) => {
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const resetPassword = (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    axios({
      method: 'PATCH',
      url: `/api/v1/auth/reset-password/${token}`,
      data: { newPassword, confirmPassword },
    })
      .then((res) => {
        SuccessToast(toast, res.message);
        router.replace(routes.home);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <VStack as="section" h="full" justify={['start', 'center']} p={1}>
      <VStack
        as="form"
        borderWidth={[0, 1]}
        borderStyle="solid"
        borderColor={useColorModeValue('gray.800', 'gray.200')}
        borderRadius="md"
        w={['full', '80vw', '70vw', '60vw', '60vw', '40vw']}
        p={[0, 4, 10]}
        spacing={4}
        onSubmit={resetPassword}
      >
        <VStack spacing={1}>
          <Heading size="lg">Reset Password</Heading>
          <Text>Set new password for your Attendance Account</Text>
        </VStack>

        {error.trim() !== '' && (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TextInput
          label="New Password"
          placeholder="••••••••••"
          value={newPassword}
          setValue={setNewPassword}
          helper="Your new password. Minimum is 8 characters."
          type={showPassword ? 'text' : 'password'}
        />

        <TextInput
          label="Confirm New Password"
          placeholder="••••••••••"
          value={confirmPassword}
          setValue={setConfirmPassword}
          helper="Confirm your password."
          type={showPassword ? 'text' : 'password'}
        />

        <Checkbox
          colorScheme="blue"
          alignSelf="start"
          onChange={() => setShowPassword(!showPassword)}
          isChecked={showPassword}
        >
          <Text fontSize="sm">Show password</Text>
        </Checkbox>

        <Button
          type="submit"
          alignSelf={['end', 'center']}
          leftIcon={<FaKey />}
          colorScheme="blue"
          disabled={
            newPassword.trim() === '' ||
            confirmPassword.trim() === '' ||
            isLoading
          }
          w="50%"
          isLoading={isLoading}
        >
          Reset password
        </Button>
      </VStack>
    </VStack>
  );
};

export default memo(ResetPasswordForm);
