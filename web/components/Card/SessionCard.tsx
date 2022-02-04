import {
  Button,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo, useState } from 'react';
import { FaFire } from 'react-icons/fa';

import { useMe, useStatusAndUser } from '../../utils/hooks';
import axios from '../../utils/http';
import routes from '../../utils/routes';
import type { Session } from '../../utils/types';
import AlertOverlay from '../Overlay/AlertOverlay';
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
  const router = useRouter();
  const toast = useToast();

  const invalidateSession = () => {
    axios({ method: 'DELETE', url: `/api/v1/sessions/me/${session.sid}` })
      .then(() => {
        SuccessToast(toast, 'Successfully invalidated a session.');

        // Mutate all states for security. Redirect if happen to delete
        // self data.
        Promise.all([mutateMe.mutateSession(), mutateMe.mutateStatus()]).then(
          () => {
            mutateStatus().then((res) => {
              if (res && !res.isAuthenticated) {
                router.push(routes.home);
              }
            });
          }
        );
      })
      .catch((err) => FailedToast(toast, err.message));
  };

  return (
    <>
      <AlertOverlay
        title="Invalidate Session"
        description="Are you sure? This is irreversible and you have to log in again on that device afterwards."
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fn={invalidateSession}
      />

      <Stack
        as="article"
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

export default memo(SessionCard);
