import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { memo } from 'react';

import type { Attendance } from '../../types/Attendance';

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

    <Box overflowX="auto" w="full">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Date (Enter)</Th>
            <Th>IP and Device (Enter)</Th>
            <Th>Remarks (Enter)</Th>
            <Th>Date (Leave)</Th>
            <Th>IP and Device (Leave)</Th>
            <Th>Remarks (Leave)</Th>
            <Th>Working Hours</Th>
          </Tr>
        </Thead>
        <Tbody>
          {attendances.map((attendance) => (
            <Tr key={attendance.attendanceID}>
              <Td>{new Date(attendance.timeEnter).toLocaleString('en-GB')}</Td>
              <Td>
                {attendance.ipAddressEnter} - {attendance.deviceEnter}
              </Td>
              <Td>{attendance.remarksEnter}</Td>
              <Td>
                {attendance.timeLeave
                  ? new Date(attendance.timeLeave).toLocaleString('en-GB')
                  : null}
              </Td>
              <Td>
                {attendance.ipAddressLeave} - {attendance.deviceLeave}
              </Td>
              <Td>{attendance.remarksLeave}</Td>
              <Td>
                {attendance.timeLeave
                  ? formatWorkingHours(
                      attendance.timeLeave,
                      attendance.timeEnter
                    )
                  : null}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  </VStack>
);

export default memo(Attendancebox);
