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
  useToast,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { memo, useState } from 'react';
import { FaKey } from 'react-icons/fa';

import TextInput from '../components/Input/TextInput';
import Layout from '../components/Layout';
import type Response from '../types/Response';
import axios from '../utils/http';
import routes from '../utils/routes';

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
  const router = useRouter();
  const toast = useToast();

  const login = () => {
    setIsLoading(true);

    axios<Response<unknown>>({
      method: 'POST',
      url: '/api/v1/auth/login',
      data: { username, password },
    })
      .then((res) => {
        setIsLoading(false);

        toast({
          title: 'Success!',
          description: res.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        router.replace(routes.home);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <Layout title={['Login']}>
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
            alignSelf={['end', 'center']}
            onClick={login}
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
  );
};

export default memo(Login);