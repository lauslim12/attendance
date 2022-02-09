import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
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
      borderColor="gray.400"
      type={isPassword ? 'password' : 'text'}
      autoComplete="off"
      placeholder={placeholder}
      value={value}
      onChange={({ currentTarget: { value } }) => setValue(value)}
    />
    <FormHelperText fontSize="xs">{helper}</FormHelperText>
  </FormControl>
);

export default memo(TextInput);
