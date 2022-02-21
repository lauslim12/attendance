import { memo } from 'react';

import Layout from '../components/Layout';
import NotAuthRoute from '../components/NotAuthRoute';
import LoginForm from '../components/Pages/Login/LoginForm';

/**
 * Login screen for the website.
 *
 * @returns React functional component.
 */
const Login = () => (
  <NotAuthRoute>
    <Layout title={['Login']}>
      <LoginForm />
    </Layout>
  </NotAuthRoute>
);

export default memo(Login);
