import { Heading, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import type { FormEvent, ReactNode } from 'react';
import { memo } from 'react';

import ErrorAlert from './ErrorAlert';

/**
 * Props.
 */
type Props = {
  children: ReactNode;
  title: string;
  description: string;
  error: string;
  onSubmit: (e: FormEvent) => void;
};

/**
 * Default full page form rendering.
 *
 * @param params - Props.
 * @returns Default layout for a full-page form.
 */
const Form = ({ children, title, description, error, onSubmit }: Props) => (
  <VStack as="section" h="full" justify={['start', 'center']} p={1}>
    <VStack
      as="form"
      borderWidth={[0, 1]}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.800', 'gray.200')}
      borderRadius="md"
      w={['full', '80vw', '70vw', '60vw', '60vw', '40vw']}
      p={[0, 4, 10]}
      spacing={4}
      onSubmit={onSubmit}
    >
      <VStack spacing={1}>
        <Heading size="lg">{title}</Heading>
        <Text>{description}</Text>
      </VStack>

      {error.trim() !== '' && <ErrorAlert error={error} />}

      {children}
    </VStack>
  </VStack>
);

export default memo(Form);
