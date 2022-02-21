import type { ColorProps } from '@chakra-ui/react';
import { Link, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { memo } from 'react';

/**
 * Props.
 */
type Props = {
  routes: { href: string; text: string; color: ColorProps['color'] }[];
};

/**
 * Renders relevant links for a form.
 *
 * @param params - Props.
 * @returns Links for the form.
 */
const FormLinks = ({ routes }: Props) => (
  <VStack align="start" w="full">
    {routes.map((r) => (
      <NextLink key={r.href} href={r.href} passHref>
        <Link fontSize="xs" color={r.color} fontWeight="bold">
          {r.text}
        </Link>
      </NextLink>
    ))}
  </VStack>
);

export default memo(FormLinks);
