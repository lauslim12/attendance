import { Checkbox, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { memo, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import { useStatusAndUser } from '../../../utils/hooks';
import axios from '../../../utils/http';
import routes from '../../../utils/routes';
import type { User } from '../../../utils/types';
import Form from '../../Form';
import FormLinks from '../../Form/FormLinks';
import SubmitButton from '../../Form/SubmitButton';
import TextInput from '../../Input/TextInput';
import { SuccessToast } from '../../Toast';

/**
 * Creates a login form to be used.
 *
 * @returns Login form.
 */
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { mutate } = useStatusAndUser();
  const router = useRouter();
  const toast = useToast();

  const login = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    axios<User>({
      method: 'POST',
      url: '/api/v1/auth/login',
      data: { username, password },
    })
      .then((res) => {
        // On success, give feedback, mutate state.
        SuccessToast(toast, res.message);
        setIsLoading(false);
        mutate({ isAuthenticated: true, isMFA: false, user: res.data }, false);

        // Replace page.
        router.replace(routes.home);
      })
      .catch((err) => {
        // On  failure, set error and remove 'setIsLoading'.
        setError(
          err.message ? err.message : 'Internal error! Please try again later!'
        );
        setIsLoading(false);
      });
  };

  return (
    <Form
      title="Login"
      description="Use your Attendance account"
      error={error}
      onSubmit={login}
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
        label="Password"
        placeholder="••••••••••"
        value={password}
        setValue={setPassword}
        helper="The password that you used to register"
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

      <FormLinks
        routes={[
          {
            href: routes.register,
            text: 'Not yet registered? Create an account!',
            color: 'orange.400',
          },
          {
            href: routes.resetPassword,
            text: 'Forgot your password? Reset it here!',
            color: 'red.400',
          },
        ]}
      />

      <SubmitButton
        Icon={FaKey}
        inputs={[username, password]}
        isLoading={isLoading}
        text="Log in"
      />
    </Form>
  );
};

export default memo(LoginForm);
