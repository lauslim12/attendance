import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Checkbox,
  Heading,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import type { FormEvent } from 'react';
import { memo, useRef, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import EmailInput from '../components/Input/EmailInput';
import PhoneInput from '../components/Input/PhoneInput';
import TextInput from '../components/Input/TextInput';
import Layout from '../components/Layout';
import axios from '../utils/http';
import routes from '../utils/routes';
import type { User } from '../utils/types';

/**
 * Dynamic import.
 */
const QRDialog = dynamic(() => import('../components/Overlay/QRDialog'));

/**
 * Registration screen for the website.
 *
 * @returns React functional component.
 */
const Register = () => {
  // Use for forms.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Use for modals.
  const [qrCode, setQRCode] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const leastDestructiveRef = useRef(null);

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
        setOpenDialog(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <>
      <QRDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        leastDestructiveRef={leastDestructiveRef}
        code={qrCode}
        name={fullName}
        redirect
      />

      <Layout title={['Register']}>
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
            onSubmit={register}
          >
            <VStack spacing={1}>
              <Heading size="lg">Register</Heading>
              <Text>To use this webservice</Text>
            </VStack>

            {error.trim() !== '' && (
              <Alert status="error" variant="left-accent">
                <AlertIcon />
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TextInput
              label="Name"
              placeholder="John Smith"
              value={fullName}
              setValue={setFullName}
              helper="Your name to identify yourself."
            />

            <TextInput
              label="Username"
              placeholder="john-smith"
              value={username}
              setValue={setUsername}
              helper="Your preferred username."
            />

            <EmailInput
              label="Email"
              placeholder="john.smith@gmail.com"
              value={email}
              setValue={setEmail}
              helper="Your email as one of the options to send an OTP."
            />

            <PhoneInput
              label="Phone number"
              placeholder="081219204571"
              value={phoneNumber}
              setValue={setPhoneNumber}
              helper="The phone number to be used in Indonesian format (with or without +62)."
            />

            <TextInput
              label="Password"
              placeholder="••••••••••"
              value={password}
              setValue={setPassword}
              helper="Your preferred password. Minimum is 8 characters."
              isPassword={!showPassword}
            />

            <TextInput
              label="Confirm Password"
              placeholder="••••••••••"
              value={confirmPassword}
              setValue={setConfirmPassword}
              helper="Confirm your password."
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

            <VStack align="start" w="full">
              <NextLink href={routes.login} passHref>
                <Link fontSize="xs" color="orange.400" fontWeight="bold">
                  Already registered? Log in!
                </Link>
              </NextLink>
            </VStack>

            <Button
              type="submit"
              alignSelf={['end', 'center']}
              leftIcon={<FaKey />}
              colorScheme="green"
              disabled={
                fullName.trim() === '' ||
                username.trim() === '' ||
                email.trim() === '' ||
                phoneNumber.trim() === '' ||
                password.trim() === '' ||
                confirmPassword.trim() === '' ||
                isLoading
              }
              w="50%"
              isLoading={isLoading}
            >
              Register
            </Button>
          </VStack>
        </VStack>
      </Layout>
    </>
  );
};

export default memo(Register);
