import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import type { Dispatch, SetStateAction } from 'react';
import { memo, useRef } from 'react';
import { FaFire } from 'react-icons/fa';

/**
 * Props.
 */
type Props = {
  title: string;
  description: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  fn: () => void;
};

/**
 * Alert Overlay component to delete a resource.
 *
 * @param params - Props.
 * @returns Alert Overlay component.
 */
const AlertOverlay = ({ title, description, isOpen, setIsOpen, fn }: Props) => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => setIsOpen(false)}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>

            <Button colorScheme="red" leftIcon={<FaFire />} onClick={fn} ml={3}>
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default memo(AlertOverlay);
