import type { ThemingProps } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { memo } from 'react';
import type { IconType } from 'react-icons';

/**
 * Props.
 */
type Props = {
  Icon: IconType;
  inputs: string[];
  isLoading: boolean;
  text: string;
  colorScheme?: ThemingProps['colorScheme'];
};

/**
 * Submit button to submit a form based on a custom component.
 *
 * @param params - Props.
 * @returns Button component to submit a form.
 */
const SubmitButton = ({
  Icon,
  inputs,
  isLoading,
  text,
  colorScheme = 'blue',
}: Props) => (
  <Button
    type="submit"
    alignSelf={['end', 'center']}
    leftIcon={<Icon />}
    colorScheme={colorScheme}
    disabled={inputs.some((input) => input.trim() === '') || isLoading}
    w="50%"
    isLoading={isLoading}
  >
    {text}
  </Button>
);

export default memo(SubmitButton);
