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
  useToast,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { memo, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import TextInput from '../components/Input/TextInput';
import Layout from '../components/Layout';
import NotAuthRoute from '../components/NotAuthRoute';
import { SuccessToast } from '../components/Toast';
import { useStatusAndUser } from '../utils/hooks';
import axios from '../utils/http';
import routes from '../utils/routes';
import type { User } from '../utils/types';

/**
 * Login screen for the website.
 *
 * @returns React functional component.
 */
const Login = () => {
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
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <NotAuthRoute>
      <Layout title={['Login']}>
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
            onSubmit={login}
          >
            <VStack spacing={1}>
              <Heading size="lg">Login</Heading>
              <Text>Use your Attendance Account</Text>
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
              placeholder="my-username"
              value={username}
              setValue={setUsername}
              helper="The username that you used to register"
            />

            <TextInput
              label="Password"
              placeholder="••••••••••"
              value={password}
              setValue={setPassword}
              helper="The password that you used to register"
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
              <NextLink href={routes.register} passHref>
                <Link fontSize="xs" color="orange.400" fontWeight="bold">
                  Not yet registered? Create an account!
                </Link>
              </NextLink>
            </VStack>

            <Button
              type="submit"
              alignSelf={['end', 'center']}
              leftIcon={<FaKey />}
              colorScheme="blue"
              disabled={
                username.trim() === '' || password.trim() === '' || isLoading
              }
              w="50%"
              isLoading={isLoading}
            >
              Log in
            </Button>
          </VStack>
        </VStack>
      </Layout>
    </NotAuthRoute>
  );
};

export default memo(Login);
