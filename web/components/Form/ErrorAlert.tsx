import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { memo } from 'react';

/**
 * Error alert to be rendered on top of a form if an error is found.
 *
 * @param params - Props.
 * @returns Error alert component.
 */
const ErrorAlert = ({ error }: { error: string }) => (
  <Alert status="error" variant="left-accent">
    <AlertIcon />
    <AlertTitle>Error!</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
);

export default memo(ErrorAlert);
