import { randomBytes as rand } from 'node:crypto';
import { promisify } from 'node:util';

/**
 * Generates a cryptographically-safe random generator as an alternative for
 * NanoID.
 *
 * @param size - Size of bytes to generate. Defaults to 64.
 * @returns Random bytes in the form of Buffer.
 */
const randomBytes = async (size = 64) => {
  const bytes = await promisify(rand)(size);

  return bytes.toString('hex');
};

export default randomBytes;
