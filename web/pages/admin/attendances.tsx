import { Button, Grid, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

import AttendanceCard from '../../components/Card/AttendanceCard';
import Layout from '../../components/Layout';
import AdminRoute from '../../components/Pages/Admin/AdminRoute';
import Spinner from '../../components/Spinner';
import { useAttendances } from '../../utils/hooks';
import routes from '../../utils/routes';

/**
 * Attendances page for administrators.
 *
 * @returns React functional component.
 */
const Attendances = () => {
  const { attendances, isLoading } = useAttendances();

  if (isLoading) return <Spinner />;

  return (
    <AdminRoute>
      <Layout title={['Users']}>
        <VStack align="start" as="section">
          <HStack w="full">
            <Text as="p" fontWeight="bold" fontSize="2xl">
              Attendances
            </Text>

            <Spacer />

            <NextLink href={routes.admin} passHref>
              <Button
                as="a"
                size="sm"
                leftIcon={<FaArrowLeft />}
                colorScheme="green"
              >
                Back
              </Button>
            </NextLink>
          </HStack>

          <Grid
            templateColumns={['1fr', 'repeat(2, 1fr)']}
            gap={3}
            w="full"
            mt={5}
          >
            {attendances &&
              attendances.map((attendance) => (
                <AttendanceCard
                  key={attendance.attendanceID}
                  attendance={attendance}
                  withName
                />
              ))}
          </Grid>
        </VStack>
      </Layout>
    </AdminRoute>
  );
};

export default memo(Attendances);
