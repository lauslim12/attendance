import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import QRCode from 'qrcode.react';
import type { MutableRefObject } from 'react';
import { memo } from 'react';
import { FaArrowRight, FaCode } from 'react-icons/fa';

import routes from '../utils/routes';

type Props = {
  isOpen: boolean;
  leastDestructiveRef: MutableRefObject<null>;
  onClose: () => void;
  code: string;
  name: string;
};

const QRDialog = ({
  isOpen,
  leastDestructiveRef,
  onClose,
  code,
  name,
}: Props) => {
  // Figure out how to do this without `querySelector` later.
  const downloadQR = () => {
    const canvas: any = document.getElementById('qr-code-canvas');
    const pngURL = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    const downloadLink = document.createElement('a');
    downloadLink.href = pngURL;
    downloadLink.download = `${Math.random().toString()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      isOpen={isOpen}
      leastDestructiveRef={leastDestructiveRef}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size="3xl"
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Authenticator QR Code
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack spacing={4} align="start">
              <Text>Thanks for registering with Attendance, {name}!</Text>

              <Text>
                Below is your QR code to be used with Authenticator apps. Use
                your Authenticator application and scan this QR code and/or save
                the QR code properly. This is used to authenticate you into the
                application. Do NOT share this with anyone, treat this like your
                password! This code will NOT be shown again, so please save it
                before proceeding.
              </Text>

              <Text>
                Without QR codes, do not worry, you can still use your email
                and/or SMS for the multi-factor authentication part of this
                webservice.
              </Text>

              <VStack w="full">
                <QRCode id="qr-code-canvas" value={code} size={150} />
              </VStack>

              <Text>
                After you are ready, feel free to click the Continue button in
                order to start using this webservice! You will be redirected
                into the homepage and you have to log in again for security.
              </Text>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              leftIcon={<FaCode />}
              colorScheme="green"
              ref={leastDestructiveRef}
              onClick={downloadQR}
            >
              Save Code
            </Button>

            <NextLink href={routes.home} passHref replace>
              <Button leftIcon={<FaArrowRight />} colorScheme="blue" ml={3}>
                Continue
              </Button>
            </NextLink>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default memo(QRDialog);
