import dynamic from 'next/dynamic';
import { memo, useRef, useState } from 'react';

import Layout from '../components/Layout';
import RegisterForm from '../components/Pages/Register/RegisterForm';

/**
 * Dynamic import.
 */
const QRDialog = dynamic(() => import('../components/Overlay/QRDialog'));

/**
 * Registration screen for the website.
 *
 * @returns React functional component.
 */
const Register = () => {
  const [dialogName, setDialogName] = useState('');
  const [qrCode, setQRCode] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const leastDestructiveRef = useRef(null);

  return (
    <Layout title={['Register']}>
      <QRDialog
        isOpen={openDialog}
        onClose={() => setOpenDialog(false)}
        leastDestructiveRef={leastDestructiveRef}
        code={qrCode}
        name={dialogName}
        redirect
      />

      <RegisterForm
        setQRCode={setQRCode}
        setOpenDialog={setOpenDialog}
        setDialogName={setDialogName}
      />
    </Layout>
  );
};

export default memo(Register);
