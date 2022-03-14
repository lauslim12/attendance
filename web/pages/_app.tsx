import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import 'focus-visible/dist/focus-visible';

import type { ThemeOverride } from '@chakra-ui/react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';

import AuthRoute from '../components/AuthRoute';
import AdminRoute from '../components/Pages/Admin/AdminRoute';
import routes from '../utils/routes';

/**
 * Fallback fonts, just in case.
 */
const fallbackFonts =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

/**
 * All protected routes that require authentication.
 */
const protectedRoutes = [
  routes.admin,
  routes.profile,
  routes.attendances,
  routes.users,
];

/**
 * All protected routes that require admin authorization.
 */
const adminRoutes = [routes.admin, routes.attendances, routes.users];

/**
 * Default listeners for router events.
 */
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
          global: (props) => ({
            '::selection': {
              backgroundColor: '#945bf170',
              color: '#fff',
            },

            // Override theme colors.
            body: {
              bg: mode('#f3f3f3', 'gray.800')(props),
            },

            // NProgress.
            '#nprogress': {
              pointerEvents: 'none',
            },
            '#nprogress .bar': {
              bgGradient: 'linear(to-r, whiteAlpha.400, blue.200)',
              h: '2px',
              left: 0,
              pos: 'fixed',
              top: 0,
              w: 'full',
              zIndex: 2000,
            },
            '.nprogress-custom-parent': {
              overflow: 'hidden',
              position: 'absolute',
            },
          }),
        },

        // Override default fonts.
        fonts: {
          body: `Inter, ${fallbackFonts}`,
          heading: `Nunito, ${fallbackFonts}`,
        },

        // Set default to light mode and use system color.
        config: {
          initialColorMode: 'light',
          useSystemColorMode: true,
        },
      } as ThemeOverride)}
    >
      <AuthRoute authRoutes={protectedRoutes}>
        <AdminRoute adminRoutes={adminRoutes}>
          <Component {...pageProps} />
        </AdminRoute>
      </AuthRoute>
    </ChakraProvider>
  );
};

export default App;
