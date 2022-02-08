import { memo } from 'react';

import Layout from '../components/Layout';
import Attendancebox from '../components/Pages/Profile/Attendancebox';
import Authenticatorbox from '../components/Pages/Profile/Authenticatorbox';
import Infobox from '../components/Pages/Profile/Infobox';
import PasswordBox from '../components/Pages/Profile/Passwordbox';
import Sessionbox from '../components/Pages/Profile/Sessionbox';
import Topbox from '../components/Pages/Profile/Topbox';
import { useMe } from '../utils/hooks';

/**
 * Profile page of the website.
 *
 * @returns React functional component.
 */
const Profile = () => {
  const { data } = useMe();

  return (
    <Layout title={['Profile']}>
      {data.status && data.status.user && (
        <>
          <Topbox user={data.status.user} />
          <Infobox status={data.status} user={data.status.user} />
          <PasswordBox />
          <Authenticatorbox user={data.status.user} status={data.status} />

          {data.attendance && <Attendancebox attendances={data.attendance} />}
          {data.sessions && <Sessionbox sessions={data.sessions} />}
        </>
      )}
    </Layout>
  );
};

export default memo(Profile);
