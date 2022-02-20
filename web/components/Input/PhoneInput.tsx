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
};

/**
 * Renders a Phone Input component.
 *
 * @param params - Object consisting of props to be supplied.
 * @returns Phone input component.
 */
const PhoneInput = ({ label, placeholder, value, setValue, helper }: Props) => (
  <FormControl isRequired>
    <FormLabel>{label}</FormLabel>
    <Input
      borderColor="gray.400"
      type="tel"
      autoComplete="off"
      placeholder={placeholder}
      value={value}
      onChange={({ currentTarget: { value } }) => setValue(value)}
    />
    <FormHelperText fontSize="xs">{helper}</FormHelperText>
  </FormControl>
);

export default memo(PhoneInput);
