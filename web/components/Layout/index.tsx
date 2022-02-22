import { chakra, Flex } from '@chakra-ui/react';
import { memo, ReactNode } from 'react';

import Footer from './Footer';
import Head from './Head';
import Header from './Header';

/**
 * Props typing that will handle below component's hydration process.
 */
type Props = {
  children: ReactNode;
  title: string[];
};

/**
 * Layout is a React Functional Component that functions as the main layout page of the application.
 * This is used in every page in order to standarize the base layout.
 * Layout is complete with SEO integrations.
 *
 * @param Props - Items to hydrate the component with.
 * @returns React Functional Component.
 */
const Layout = ({ children, title }: Props) => (
  <>
    <Head title={title} />

    <Flex h="100vh" direction="column" maxW="1700px" mx="auto">
      <Header />

      <chakra.div as="main" p={4} flex={1} mt={5} mb={5}>
        {children}
      </chakra.div>

      <Footer />
    </Flex>
  </>
);

export default memo(Layout);
