import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Heading,
  Link,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import type { FormEvent } from 'react';
import { memo, useState } from 'react';
import { FaLockOpen } from 'react-icons/fa';

import axios from '../../../utils/http';
import routes from '../../../utils/routes';
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
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
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
          <Heading size="lg">Forgot Password</Heading>
          <Text>Reset your Attendance Account</Text>
        </VStack>

        {error.trim() !== '' && (
          <Alert status="error" variant="left-accent">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
          helper="Your email associated with that username"
          type="email"
        />

        <VStack align="start" w="full">
          <NextLink href={routes.register} passHref>
            <Link fontSize="xs" color="orange.400" fontWeight="bold">
              Not yet registered? Create an account!
            </Link>
          </NextLink>

          <NextLink href={routes.login} passHref>
            <Link fontSize="xs" color="blue.400" fontWeight="bold">
              Remembered your password? Login!
            </Link>
          </NextLink>
        </VStack>

        <Button
          type="submit"
          alignSelf={['end', 'center']}
          leftIcon={<FaLockOpen />}
          colorScheme="blue"
          disabled={username.trim() === '' || email.trim() === '' || isLoading}
          w="50%"
          isLoading={isLoading}
        >
          Reset password
        </Button>
      </VStack>
    </VStack>
  );
};

export default memo(ForgotPasswordForm);
