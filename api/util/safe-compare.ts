import { timingSafeEqual } from 'node:crypto';

/**
 * Safely compares two strings with `timingSafeEqual` to prevent timing attacks.
 * Allows to return 'false' if two strings are not at the same length.
 *
 * @param a - A string.
 * @param b - A string.
 * @returns A boolean value to check whether both strings are equal or not.
 */
const safeCompare = (a: string, b: string) => {
  try {
    return timingSafeEqual(
      Buffer.from(a.normalize()),
      Buffer.from(b.normalize())
    );
  } catch {
    return false;
  }
};

export default safeCompare;
