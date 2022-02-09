import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  useColorModeValue,
} from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';
import { memo } from 'react';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  helper: string;
  isPassword?: boolean;
};

/**
 * Renders a Text Input component.
 *
 * @param params - Object consisting of props to be supplied.
 * @returns Text input component.
 */
const TextInput = ({
  label,
  placeholder,
  value,
  setValue,
  helper,
  isPassword = false,
}: Props) => (
  <FormControl isRequired>
    <FormLabel>{label}</FormLabel>
    <Input
      borderColor={useColorModeValue('gray.800', 'gray.200')}
      type={isPassword ? 'password' : 'text'}
      autoComplete="off"
      placeholder={placeholder}
      value={value}
      onChange={({ currentTarget: { value } }) => setValue(value)}
      _hover={{ borderColor: 'green.400' }}
    />
    <FormHelperText fontSize="xs">{helper}</FormHelperText>
  </FormControl>
);

export default memo(TextInput);
