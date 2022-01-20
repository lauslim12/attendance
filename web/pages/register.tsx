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
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import TextInput from '../components/Input/TextInput';
import Layout from '../components/Layout';
import axios from '../utils/http';
import routes from '../utils/routes';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const register = () => {
    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setIsLoading(true);
    axios({
      method: 'POST',
      url: '/api/v1/auth/register',
      data: { username, password, email, phoneNumber, fullName },
    })
      .then((res) => {
        console.log(res);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <Layout title={['Register']}>
      <VStack as="section" h="full" justify={['start', 'center']} p={1}>
        <VStack
          as="form"
          borderWidth={[0, 1]}
          borderStyle="solid"
          borderColor="gray.300"
          borderRadius="md"
          w={['full', '80vw', '70vw', '60vw', '40vw']}
          p={[0, 4, 10]}
          spacing={4}
        >
          <VStack spacing={1}>
            <Heading size="lg">Register</Heading>
            <Text>To use this webservice</Text>

            <Text fontSize="xs" textAlign="center" fontWeight="bold">
              You may use disposable email addresses like 10minutemail or
              whatever, but please DO NOT use an invalid phone number (SMS
              charges are expensive). Thank you for understanding.
            </Text>
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

          <TextInput
            label="Email"
            placeholder="john.smith@gmail.com"
            value={email}
            setValue={setEmail}
            helper="Your email. Feel free to use a disposable email address."
          />

          <TextInput
            label="Phone Number"
            placeholder="+62-890-1122-3344"
            value={phoneNumber}
            setValue={setPhoneNumber}
            helper="Your phone number. Please do not use an invalid phone number."
          />

          <TextInput
            label="Password"
            placeholder="••••••••••"
            value={password}
            setValue={setPassword}
            helper="Your preferred password."
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
            alignSelf={['end', 'center']}
            onClick={register}
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
  );
};

export default memo(Register);
