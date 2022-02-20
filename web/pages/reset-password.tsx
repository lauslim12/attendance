import { useRouter } from 'next/router';
import { memo } from 'react';

import Layout from '../components/Layout';
import NotAuthRoute from '../components/NotAuthRoute';
import ForgotPasswordForm from '../components/Pages/ResetPassword/ForgotPasswordForm';
import ResetPasswordForm from '../components/Pages/ResetPassword/ResetPasswordForm';

/**
 * Page for the user to reset their password.
 *
 * @returns React functional component.
 */
const ResetPassword = () => {
  const router = useRouter();
  const { token, action } = router.query;

  return (
    <NotAuthRoute>
      <Layout title={['Reset Password']}>
        {action !== 'reset' && <ForgotPasswordForm />}

        {action === 'reset' && token && !Array.isArray(token) && (
          <ResetPasswordForm token={token} />
        )}
      </Layout>
    </NotAuthRoute>
  );
};

export default memo(ResetPassword);
