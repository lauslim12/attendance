import { Checkbox, Text } from '@chakra-ui/react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { memo, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import axios from '../../../utils/http';
import routes from '../../../utils/routes';
import { User } from '../../../utils/types';
import Form from '../../Form';
import FormLinks from '../../Form/FormLinks';
import SubmitButton from '../../Form/SubmitButton';
import TextInput from '../../Input/TextInput';

/**
 * Props.
 */
type Props = {
  setQRCode: Dispatch<SetStateAction<string>>;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  setDialogName: Dispatch<SetStateAction<string>>;
};

/**
 * Creates a registration form.
 *
 * @returns Registration form.
 */
const RegisterForm = ({ setQRCode, setOpenDialog, setDialogName }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const register = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setIsLoading(true);
    axios<User & { uri: string }>({
      method: 'POST',
      url: '/api/v1/auth/register',
      data: { username, password, email, phoneNumber, fullName },
    })
      .then((res) => {
        setQRCode(res.data.uri);
        setDialogName(fullName);
        setOpenDialog(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err.message ? err.message : 'Internal error! Please try again later!'
        );
        setIsLoading(false);
      });
  };

  return (
    <Form
      title="Register"
      description="To use this webservice"
      error={error}
      onSubmit={register}
    >
      <TextInput
        label="Name"
        placeholder="Ran"
        value={fullName}
        setValue={setFullName}
        helper="Your name to identify yourself."
        type="text"
      />

      <TextInput
        label="Username"
        placeholder="kharansyah"
        value={username}
        setValue={setUsername}
        helper="Your preferred username to be used to login."
        type="text"
      />

      <TextInput
        label="Email"
        placeholder="ran@gmail.com"
        value={email}
        setValue={setEmail}
        helper="Your email as one of the options to send an OTP."
        type="email"
      />

      <TextInput
        label="Phone number"
        placeholder="081219204571"
        value={phoneNumber}
        setValue={setPhoneNumber}
        helper="The phone number to be used in Indonesian format (with or without +62, dashes or no dashes allowed)."
        type="tel"
      />

      <TextInput
        label="Password"
        placeholder="••••••••••"
        value={password}
        setValue={setPassword}
        helper="Your preferred password. Minimum is 8 characters."
        type={showPassword ? 'text' : 'password'}
      />

      <TextInput
        label="Confirm Password"
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

      <FormLinks
        routes={[
          {
            href: routes.login,
            text: 'Already registered? Log in!',
            color: 'orange.400',
          },
        ]}
      />

      <SubmitButton
        Icon={FaKey}
        inputs={[
          fullName,
          username,
          email,
          phoneNumber,
          password,
          confirmPassword,
        ]}
        isLoading={isLoading}
        text="Register"
      />
    </Form>
  );
};

export default memo(RegisterForm);
