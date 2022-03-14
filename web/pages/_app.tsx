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
          global: (props: any) => ({
            '::selection': {
              backgroundColor: '#945bf170',
              color: '#fff',
            },

            // Override theme colors.
            body: {
              bg: mode('#f3f3f3', 'gray.800')(props),
            },
          }),
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
      <AuthRoute authRoutes={protectedRoutes}>
        <AdminRoute adminRoutes={adminRoutes}>
          <Component {...pageProps} />
        </AdminRoute>
      </AuthRoute>
    </ChakraProvider>
  );
};

export default App;
