import {
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import type { Dispatch, HTMLInputTypeAttribute, SetStateAction } from 'react';
import { memo } from 'react';
import { FaEnvelope, FaLock, FaPen, FaPhone } from 'react-icons/fa';

/**
 * Props.
 */
type Props = {
  label: string;
  placeholder: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  helper: string;
  type: HTMLInputTypeAttribute;
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
  type,
}: Props) => (
  <FormControl isRequired>
    <FormLabel>{label}</FormLabel>

    <InputGroup>
      {type === 'text' && (
        <InputLeftElement pointerEvents="none">
          <Icon as={FaPen} color="gray.400" />
        </InputLeftElement>
      )}

      {type === 'email' && (
        <InputLeftElement pointerEvents="none">
          <Icon as={FaEnvelope} color="gray.400" />
        </InputLeftElement>
      )}

      {type === 'tel' && (
        <InputLeftElement pointerEvents="none">
          <Icon as={FaPhone} color="gray.400" />
        </InputLeftElement>
      )}

      {type === 'password' && (
        <InputLeftElement pointerEvents="none">
          <Icon as={FaLock} color="gray.400" />
        </InputLeftElement>
      )}

      <Input
        borderColor="gray.400"
        type={type}
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={({ currentTarget: { value } }) => setValue(value)}
        pattern={type === 'tel' ? '/^[-+0-9]+$/' : undefined}
      />
    </InputGroup>

    <FormHelperText fontSize="xs">{helper}</FormHelperText>
  </FormControl>
);

export default memo(TextInput);
