import { Checkbox, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { memo, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import axios from '../../../utils/http';
import routes from '../../../utils/routes';
import Form from '../../Form';
import SubmitButton from '../../Form/SubmitButton';
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
        setError(
          err.message
            ? err.message
            : 'Internal error occured! Please try again later!'
        );
        setIsLoading(false);
      });
  };

  return (
    <Form
      title="Reset Password"
      description="Set new password for your Attendance Account!"
      error={error}
      onSubmit={resetPassword}
    >
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

      <SubmitButton
        Icon={FaKey}
        inputs={[newPassword, confirmPassword]}
        isLoading={isLoading}
        text="Reset password"
      />
    </Form>
  );
};

export default memo(ResetPasswordForm);
