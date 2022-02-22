import NextHead from 'next/head';
import { memo } from 'react';

/**
 * Sets the HTML Head component for a single Layout.
 *
 * @param params - Props.
 * @returns Next's document head component.
 */
const Head = ({ title }: { title?: string[] }) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f67e4d" />
    <meta name="msapplication-navbutton-color" content="#f67e4d" />
    <meta name="apple-mobile-web-app-status-bar-style" content="#f67e4d" />

    <title>
      {title
        ? [...title.map((x) => x?.trim()).filter((x) => x), 'Attendance'].join(
            ' · '
          )
        : 'Attendance'}
    </title>
  </NextHead>
);

export default memo(Head);
