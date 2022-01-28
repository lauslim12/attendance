import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Grid,
  Heading,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo, useRef, useState } from 'react';
import { FaFire } from 'react-icons/fa';

import { useMe, useStatusAndUser } from '../../utils/hooks';
import axios from '../../utils/http';
import routes from '../../utils/routes';
import type { Session } from '../../utils/types';
import { FailedToast, SuccessToast } from '../Toast';

/**
 * Parses UNIX time to human readable format.
 *
 * @param time - Time in UNIX string.
 * @returns Formatted UNIX time.
 */
const parseUNIXTime = (time: string) =>
  new Date(Number.parseInt(time, 10)).toLocaleString('en-GB');

/**
 * Session card to invalidate sessions.
 *
 * @param params - Props.
 * @returns React functional component.
 */
const SessionCard = ({ session }: { session: Session }) => {
  const { mutate: mutateMe } = useMe();
  const { mutate: mutateStatus } = useStatusAndUser();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);
  const router = useRouter();
  const toast = useToast();

  const invalidateSession = (sid: string) => {
    axios({ method: 'DELETE', url: `/api/v1/sessions/me/${sid}` })
      .then(() => {
        SuccessToast(toast, 'Successfully invalidated a session.');

        // Mutate all states for security. Redirect if happen to delete
        // self data.
        mutateMe.mutateSession().then(() => {
          mutateStatus().then((res) => {
            if (res && !res.isAuthenticated) {
              router.push(routes.home);
            }
          });
        });
      })
      .catch((err) => FailedToast(toast, err.message));
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Invalidate Session
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This is irreversible and you have to log in again on
              that device afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>

              <Button
                colorScheme="red"
                leftIcon={<FaFire />}
                onClick={() => {
                  invalidateSession(session.sid);
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Stack
        align="center"
        spacing={3}
        p={5}
        border="1px solid #e1e7ec"
        borderRadius="md"
        boxShadow="md"
        textAlign="center"
        _hover={useColorModeValue(
          { background: 'gray.300', cursor: 'pointer' },
          { background: 'gray.700', cursor: 'pointer' }
        )}
      >
        <Text fontSize="lg" fontWeight="bold">
          {session.sessionInfo.device}
        </Text>

        <Spacer />

        <Text fontWeight="bold">{session.sessionInfo.ip}</Text>

        <VStack spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            Signed in:
          </Text>
          <Text fontSize="sm">{parseUNIXTime(session.signedIn)}</Text>
        </VStack>

        <VStack spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            Last active:
          </Text>
          <Text fontSize="sm">{parseUNIXTime(session.lastActive)}</Text>
        </VStack>

        <Button
          leftIcon={<FaFire />}
          variant="solid"
          colorScheme="red"
          size="sm"
          w="full"
          onClick={() => setIsOpen(true)}
        >
          Invalidate
        </Button>
      </Stack>
    </>
  );
};

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
