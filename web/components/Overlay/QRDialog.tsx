import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  LightMode,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import QRCode from 'qrcode.react';
import type { MutableRefObject } from 'react';
import { memo } from 'react';
import { FaArrowRight, FaCode } from 'react-icons/fa';

import routes from '../../utils/routes';

/**
 * Props.
 */
type Props = {
  isOpen: boolean;
  leastDestructiveRef: MutableRefObject<null>;
  onClose: () => void;
  code: string;
  name: string;
  redirect?: boolean;
};

/**
 * QRDialog is a dialog box consisting of the registration QR.
 *
 * @param params - Object of props.
 * @returns React functional component.
 */
const QRDialog = ({
  isOpen,
  leastDestructiveRef,
  onClose,
  code,
  name,
  redirect = false,
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
    <LightMode>
      <AlertDialog
        motionPreset="slideInBottom"
        isOpen={isOpen}
        leastDestructiveRef={leastDestructiveRef}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="3xl"
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="white" color="black">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Authenticator QR Code
            </AlertDialogHeader>

            <AlertDialogBody>
              <VStack spacing={4} align="start">
                <Text>Thanks for using Attendance, {name}!</Text>

                <Text>
                  Below is your QR code to be used with Authenticator apps. Use
                  your Authenticator application and scan this QR code and/or
                  save the QR code properly. This is used to authenticate you
                  into the application. Do NOT share this with anyone, treat
                  this like your password! This code will NOT be shown again, so
                  please save it before proceeding.
                </Text>

                <Text>
                  Examples of authenticator applications are Google
                  Authenticator, Microsoft Authenticator, LastPass
                  Authenticator, Authy, andOTP, and many more. You can just use
                  one of them!
                </Text>

                <Text>
                  Without QR codes, do not worry, you can still use your email
                  for the multi-factor authentication part of this webservice.
                  For your information, this modal is intentionally made to be
                  light-colored so you can scan the QR code with ease.
                </Text>

                <VStack w="full">
                  <QRCode id="qr-code-canvas" value={code} size={150} />
                </VStack>

                {/* <Text>
                After you are ready, you will receive a confirmation email in
                your email if this is the first time you are registering. Please
                click on the validation link that is sent to your email. By
                clicking the Continue button, you will be redirected into the
                homepage.
              </Text> */}

                <Text>
                  By clicking the Continue button, this modal will be closed and
                  you may have to log in for security.
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

              {redirect ? (
                <NextLink href={routes.home} passHref replace>
                  <Button
                    as="a"
                    leftIcon={<FaArrowRight />}
                    colorScheme="blue"
                    ml={3}
                  >
                    Continue
                  </Button>
                </NextLink>
              ) : (
                <Button
                  leftIcon={<FaArrowRight />}
                  colorScheme="blue"
                  ml={3}
                  onClick={onClose}
                >
                  Continue
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </LightMode>
  );
};

export default memo(QRDialog);
