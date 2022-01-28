import {
  Badge,
  Grid,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Text,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import { FaFlagCheckered, FaHourglassStart } from 'react-icons/fa';
import { memo } from 'react';

import type { Attendance } from '../../utils/types';

/**
 * Formats working hours into a readable format.
 *
 * @param end - End date as string.
 * @param start - Start date as string.
 * @returns A string in the format of H/M/S.
 */
const formatWorkingHours = (end: string, start: string) => {
  const hours = new Date(end).getHours() - new Date(start).getHours();
  const minutes = new Date(end).getMinutes() - new Date(start).getMinutes();
  const seconds = new Date(end).getSeconds() - new Date(start).getSeconds();

  return `${Math.abs(hours)}h${Math.abs(minutes)}m${Math.abs(seconds)}s`;
};

/**
 * Ensures that date is in the proper format.
 *
 * @param date - Date in the string format.
 * @param type - Type of the wished format.
 * @returns Formatted date.
 */
const formatDate = (date: string, type: 'complete' | 'month' | 'day') => {
  if (type === 'complete') {
    return new Date(date).toLocaleString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }

  if (type === 'month') {
    return new Date(date).toLocaleString('en-GB', { month: 'short' });
  }

  return new Date(date).toLocaleString('en-GB', { day: 'numeric' });
};

/**
 * Attendance card.
 *
 * @param params - Props.
 * @returns React functional component.
 */
const AttendanceCard = ({ attendance }: { attendance: Attendance }) => {
  const [largerThan1280] = useMediaQuery('(min-width: 1280px)');

  return (
    <VStack
      as="article"
      align="start"
      border="1px dashed #bb48bf"
      borderRadius="md"
      p={3}
    >
      <HStack align="center">
        <VStack p={2}>
          <Heading as="p" size="lg" color="pink.400">
            {formatDate(attendance.timeEnter, 'day')}
          </Heading>

          <Heading as="p" size="md">
            {formatDate(attendance.timeEnter, 'month')}
          </Heading>

          {attendance.timeLeave && (
            <Badge colorScheme="linkedin">
              {formatWorkingHours(attendance.timeLeave, attendance.timeEnter)}
            </Badge>
          )}
        </VStack>

        <VStack align="start" px={2} fontSize="sm" w="full">
          <List spacing={2}>
            <ListItem>
              <ListIcon as={FaHourglassStart} />
              Clocked in at {formatDate(
                attendance.timeEnter,
                'complete'
              )} with {attendance.deviceEnter} ({attendance.ipAddressEnter}).
            </ListItem>

            {attendance.remarksEnter && largerThan1280 && (
              <ListItem fontSize="xs" fontStyle="italic">
                Remarks: {attendance.remarksEnter}
              </ListItem>
            )}

            {attendance.timeLeave ? (
              <>
                <ListItem>
                  <ListIcon as={FaFlagCheckered} />
                  Clocked out at {formatDate(
                    attendance.timeLeave,
                    'complete'
                  )}{' '}
                  with {attendance.deviceLeave} ({attendance.ipAddressLeave}).
                </ListItem>

                {attendance.remarksLeave && largerThan1280 && (
                  <ListItem fontSize="xs" fontStyle="italic">
                    Remarks: {attendance.remarksLeave}
                  </ListItem>
                )}
              </>
            ) : (
              <ListItem>You have not yet checked out!</ListItem>
            )}
          </List>
        </VStack>
      </HStack>
    </VStack>
  );
};

/**
 * Attendance box to show attendances.
 *
 * @param params - Props.
 * @returns React functional component.
 */
const Attendancebox = ({ attendances }: { attendances: Attendance[] }) => (
  <VStack as="section" p={[2, 10]} spacing={5} mt={10}>
    <Heading as="p" size="lg">
      ✅ Attendances
    </Heading>
    <Text textAlign="center">All of your attendances in this system.</Text>

    {attendances.length ? (
      <Grid templateColumns={['1fr', 'repeat(2, 1fr)']} gap={3} w="full" mt={5}>
        {attendances.map((attendance) => (
          <AttendanceCard
            key={attendance.attendanceID}
            attendance={attendance}
          />
        ))}
      </Grid>
    ) : (
      <Text fontSize="sm" textAlign="center">
        No attendances data found in the system. Try to check in!
      </Text>
    )}
  </VStack>
);

export default memo(Attendancebox);
