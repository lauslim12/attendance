import type { As, SpaceProps, TypographyProps } from '@chakra-ui/react';
import { Heading, useColorModeValue } from '@chakra-ui/react';
import { memo } from 'react';

/**
 * Props.
 */
type Props = {
  text: string;
  as?: As;
  fontSize?: TypographyProps['fontSize'];
  letterSpacing?: TypographyProps['letterSpacing'];
  mb?: SpaceProps['mb'];
};

/**
 * Main Heading to be used in client-side facing pages.
 *
 * @param params - An object, text and optionally the font size.
 * @returns React functional component.
 */
const MainHeading = ({
  text,
  as = 'h1',
  fontSize = ['4xl', '4xl', '6xl'],
  letterSpacing = 0,
  mb = 0,
}: Props) => (
  <Heading
    as={as}
    bgGradient={useColorModeValue(
      'linear(to-r, #00baff, #00baff, #063ef9)',
      'linear(to-r, #945bf1, #bb48bf, #bb48bf, #f67e4d)'
    )}
    bgClip="text"
    fontSize={fontSize}
    fontWeight="extrabold"
    letterSpacing={letterSpacing}
    mb={mb}
  >
    {text}
  </Heading>
);

export default memo(MainHeading);
