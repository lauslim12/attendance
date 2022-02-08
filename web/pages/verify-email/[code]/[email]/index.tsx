import { Button, Heading, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';

import Layout from '../../../../components/Layout';
import Spinner from '../../../../components/Spinner';
import axios from '../../../../utils/http';
import routes from '../../../../utils/routes';

/**
 * Page to verify someone's email.
 *
 * @returns Verification email page.
 */
const VerifyEmailPage = () => {
  const [result, setResult] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!router.query.code || !router.query.email) {
      return;
    }

    axios({
      method: 'PATCH',
      url: `/api/v1/auth/verify-email/${router.query.code}/${router.query.email}`,
    })
      .then((res) => setResult(res.message))
      .catch((err) => setResult(err.message));
  }, [router.query]);

  return (
    <>
      {router.query.code && router.query.email ? (
        <Layout title={['Verify Email']}>
          <VStack as="section" justify="center" h="full" spacing={4}>
            <Heading size="lg" textAlign="center">
              {result}
            </Heading>

            <NextLink href={routes.home} passHref>
              <Button as="a" leftIcon={<FaHome />} colorScheme="pink">
                Back to Home
              </Button>
            </NextLink>
          </VStack>
        </Layout>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default memo(VerifyEmailPage);
