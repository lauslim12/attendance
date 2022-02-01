import 'focus-visible/dist/focus-visible';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

/**
 * Fonts to use in-case Google Fonts failed to load.
 */
const fallbackFonts =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

/**
 * App is used to handle all of the requests toward my server.
 *
 * @param Props - Component from Next.js's request.
 * @returns React Functional Component
 */
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider
      resetCSS
      theme={extendTheme({
        styles: {
          global: {
            '::selection': {
              backgroundColor: '#945bf170',
              color: '#fff',
            },
          },
        },
        fonts: {
          body: `Inter, ${fallbackFonts}`,
          heading: `Nunito, ${fallbackFonts}`,
        },
        config: {
          initialColorMode: 'light',
          useSystemColorMode: true,
        },
      })}
    >
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;
