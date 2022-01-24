import type { TypographyProps } from '@chakra-ui/react';
import { Heading, useColorModeValue } from '@chakra-ui/react';
import { memo } from 'react';

/**
 * Props.
 */
type Props = {
  text: string;
  fontSize?: TypographyProps['fontSize'];
};

/**
 * Main Heading to be used in client-side facing pages.
 *
 * @param params - An object, text and optionally the font size.
 * @returns React functional component.
 */
const MainHeading = ({ text, fontSize = ['4xl', '4xl', '6xl'] }: Props) => (
  <Heading
    as="h1"
    bgGradient={useColorModeValue(
      'linear(to-r, #00baff, #00baff, #063ef9)',
      'linear(to-r, #945bf1, #bb48bf, #bb48bf, #f67e4d)'
    )}
    bgClip="text"
    fontSize={fontSize}
    fontWeight="extrabold"
  >
    {text}
  </Heading>
);

export default memo(MainHeading);
