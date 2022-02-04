import { Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';

import type { Attendance } from '../../../utils/types';
import AttendanceCard from '../../Card/AttendanceCard';

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
