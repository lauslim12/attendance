import {
  FormControl,
  FormHelperText,
  FormLabel,
  Select,
} from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';
import { memo } from 'react';

/**
 * Props.
 */
type Props = {
  label: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  options: string[];
  helper: string;
};

/**
 * Renders a Select component.
 *
 * @param params - Object consisting of props to be supplied.
 * @returns Select input component.
 */
const SelectInput = ({ label, value, setValue, options, helper }: Props) => (
  <FormControl isRequired>
    <FormLabel>{label}</FormLabel>
    <Select
      placeholder="Select option"
      value={value}
      onChange={({ currentTarget: { value } }) => setValue(value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
    <FormHelperText fontSize="xs">{helper}</FormHelperText>
  </FormControl>
);

export default memo(SelectInput);
