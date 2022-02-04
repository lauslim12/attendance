import { Grid, Heading, Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';

import type { Session } from '../../../utils/types';
import SessionCard from '../../Card/SessionCard';

/**
 * Session box to configure sessions.
 *
 * @returns React functional component.
 */
const Sessionbox = ({ sessions }: { sessions: Session[] }) => (
  <VStack as="section" p={[2, 10]} spacing={5} mt={10}>
    <Heading as="p" size="lg">
      🖥️ Sessions
    </Heading>
    <Text textAlign="center">
      You may examine your sessions and invalidate them if necessary.
    </Text>

    <Grid
      templateColumns={{
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(5, 1fr)',
      }}
      gap={2}
      w="full"
      mt={5}
    >
      {sessions.map((session) => (
        <SessionCard key={session.sid} session={session} />
      ))}
    </Grid>
  </VStack>
);

export default memo(Sessionbox);
