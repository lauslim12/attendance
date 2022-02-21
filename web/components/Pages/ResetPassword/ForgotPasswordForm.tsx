import { useToast } from '@chakra-ui/react';
import type { FormEvent } from 'react';
import { memo, useState } from 'react';
import { FaLockOpen } from 'react-icons/fa';

import axios from '../../../utils/http';
import routes from '../../../utils/routes';
import Form from '../../Form';
import FormLinks from '../../Form/FormLinks';
import SubmitButton from '../../Form/SubmitButton';
import TextInput from '../../Input/TextInput';
import { SuccessToast } from '../../Toast';

/**
 * Special component for forget passwords.
 *
 * @returns React functional component.
 */
const ForgotPasswordForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const resetPassword = (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    axios({
      method: 'POST',
      url: '/api/v1/auth/forgot-password',
      data: { username, email },
    })
      .then((res) => SuccessToast(toast, res.message))
      .catch((err) =>
        setError(
          err.message ? err.message : 'Internal error! Please try again later!'
        )
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <Form
      title="Forgot Password"
      description="Reset your Attendance Account"
      error={error}
      onSubmit={resetPassword}
    >
      <TextInput
        label="Username"
        placeholder="Username"
        value={username}
        setValue={setUsername}
        helper="The username that you used to register"
        type="text"
      />

      <TextInput
        label="Email"
        placeholder="ran@gmail.com"
        value={email}
        setValue={setEmail}
        helper="The email associated with that username"
        type="email"
      />

      <FormLinks
        routes={[
          {
            href: routes.register,
            text: 'Not yet registered? Create an account!',
            color: 'orange.400',
          },
          {
            href: routes.login,
            text: 'Remembered your password? Log in!',
            color: 'blue.400',
          },
        ]}
      />

      <SubmitButton
        Icon={FaLockOpen}
        inputs={[username, email]}
        isLoading={isLoading}
        text="Reset password"
      />
    </Form>
  );
};

export default memo(ForgotPasswordForm);
