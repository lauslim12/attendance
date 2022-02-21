import type { UseToastOptions } from '@chakra-ui/react';

/**
 * Displays a failed toast, if, for a reason, a request fails. In this toast,
 * sometimes `message` is of the type 'any'. For this reason, we place a default value
 * just in case `message` also fails.
 *
 * @param toast - ChakraUI's toast object.
 * @param message - Message to be shown in the toast.
 * @returns Custom, standarized ChakraUI's toast.
 */
export const FailedToast = (
  toast: (options?: UseToastOptions | undefined) => string | number | undefined,
  message = 'Internal server error occured, please try again later!'
) =>
  toast({
    title: 'Error!',
    description: message,
    status: 'error',
    duration: 1500,
    isClosable: true,
  });

/**
 * Displays a success toast if applicable.
 *
 * @param toast - ChakraUI's toast object.
 * @param message - Message to be shown in the toast.
 * @returns Custom, standarized ChakraUI's toast.
 */
export const SuccessToast = (
  toast: (options?: UseToastOptions | undefined) => string | number | undefined,
  message: string
) =>
  toast({
    title: 'Success!',
    description: message,
    status: 'success',
    duration: 1500,
    isClosable: true,
  });
