import {
  Button,
  Grid,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { memo, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaCheckDouble, FaDatabase, FaKey } from 'react-icons/fa';

import AdminRoute from '../../components/Admin/AdminRoute';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';
import { useStatusAndUser } from '../../utils/hooks';
import routes from '../../utils/routes';

/**
 * Dynamic import.
 */
const OTPModal = dynamic(() => import('../../components/Overlay/OTPModal'));

/**
 * Props for menu.
 */
type Props = {
  header: string;
  description: string;
  icon: IconType;
  gradientStart: string;
  gradientEnd: string;
  gradientAim: string;
  href: string;
};

/**
 * Menu card for admins.
 *
 * @param params - Props.
 * @returns Menu as React functional component.
 */
const Menu = ({
  header,
  description,
  icon,
  gradientStart,
  gradientEnd,
  gradientAim,
  href,
}: Props) => (
  <NextLink href={href} passHref>
    <Link _hover={{ textDecoration: 'none' }}>
      <VStack
        bg="twitter.400"
        py={10}
        borderRadius="md"
        justify="center"
        spacing={5}
        bgGradient={`linear(${gradientAim}, ${gradientStart}, ${gradientEnd})`}
        _hover={{
          opacity: 0.7,
          transform: 'scale(1.05)',
          transition: 'all 0.5s ease',
        }}
      >
        <Text fontSize="lg" fontWeight="bold" color="black">
          {header}
        </Text>
        <Text color="black">{description}</Text>
        <Icon as={icon} boxSize="30px" color="black" />
      </VStack>
    </Link>
  </NextLink>
);

/**
 * Admin panel of the website.
 *
 * @returns React functional component.
 */
const Admin = () => {
  const { status, isLoading } = useStatusAndUser();
  const [open, setOpen] = useState(false);

  if (isLoading) return <Spinner />;

  return (
    <AdminRoute>
      {status && status.user && (
        <Layout title={['Admin']}>
          <OTPModal
            isOpen={open}
            onClose={() => setOpen(false)}
            user={status.user}
          />

          <VStack as="section" spacing={3}>
            <Heading size="md">Welcome, {status.user.fullName}!</Heading>

            <Text>
              {status.isMFA
                ? 'Check out below menu for the configurations you may need to do.'
                : 'Please authorize yourself before performing operations.'}
            </Text>

            {status.isMFA ? (
              <Grid
                pt={5}
                templateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
                gap={5}
                w={['full', '60vw', '50vw']}
              >
                <Menu
                  header="Users"
                  description="Configuration of users"
                  icon={FaDatabase}
                  gradientAim="to-br"
                  gradientStart="#a5dd72"
                  gradientEnd="#83c77c"
                  href={routes.users}
                />

                <Menu
                  header="Attendances"
                  description="Report of all user attendances"
                  icon={FaCheckDouble}
                  gradientAim="to-bl"
                  gradientStart="#f5c042"
                  gradientEnd="#f8cc47"
                  href={routes.attendances}
                />
              </Grid>
            ) : (
              <Button
                leftIcon={<FaKey />}
                colorScheme="twitter"
                onClick={() => setOpen(true)}
              >
                Authorize yourself with MFA (OTP)
              </Button>
            )}
          </VStack>
        </Layout>
      )}
    </AdminRoute>
  );
};

export default memo(Admin);
