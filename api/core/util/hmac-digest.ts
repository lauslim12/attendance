import { createHmac } from 'node:crypto';

/**
 * Create a HOTP-base (the ALG(K, C) in the formula) by using buffers.
 * Let's say this will return 'HOTPBase' mathematically.
 *
 * @param algorithm - Algorithm to use, can be `SHA1`, `SHA256`, or `SHA512`.
 * @param key - The shared secret to be encoded.
 * @param message - The 'message' object, in this case 'counter' (TOTP).
 * @returns The buffer in the form of 'Uint8Array' for further processing.
 */
const hmacDigest = (
  algorithm: 'SHA1' | 'SHA256' | 'SHA512',
  key: ArrayBuffer,
  message: ArrayBuffer
) => {
  const hmac = createHmac(algorithm, Buffer.from(key));
  hmac.update(Buffer.from(message));

  return hmac.digest().buffer;
};

export default hmacDigest;
