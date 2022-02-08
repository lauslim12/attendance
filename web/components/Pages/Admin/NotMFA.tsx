import { Button, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';
import { FaBolt } from 'react-icons/fa';

import routes from '../../../utils/routes';
import MainHeading from '../../MainHeading';

/**
 * NotMFA: A component to show error message if someone accesses
 * MFA-protected routes.
 *
 * @param params - Error object if any.
 * @returns Not MFA authenticated functional component.
 */
const NotMFA = ({ error }: { error: any }) => (
  <VStack
    as="section"
    w="full"
    h="full"
    justify="center"
    spacing={4}
    textAlign="center"
  >
    <MainHeading text="Unauthorized MFA!" />

    <Text>{error.message}</Text>

    <NextLink href={routes.admin} passHref>
      <Button
        as="a"
        leftIcon={<FaBolt />}
        colorScheme="green"
        variant="outline"
      >
        Back to Admin
      </Button>
    </NextLink>
  </VStack>
);

export default memo(NotMFA);
