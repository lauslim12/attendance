import argon2 from 'argon2';

/**
 * Asynchronously hashes a user's password with Argon2 algorithm. Uses default
 * settings: 3 iterations, 4096 memory cost, one parallelism, 32 hash length,
 * 16 salt length, version 0x13 (19), and type is `argon2i`.
 *
 * @param password - User's password.
 * @returns Argon2 hashed password.
 */
export const hashPassword = (password: string) =>
  argon2.hash(password.normalize());

/**
 * Verifies 'Argon2' hash and its plaintext variant.
 *
 * @param hash - Hash form of the password.
 * @param plaintext - Plaintext form of the password.
 * @returns Boolean value whether the password is correct or not.
 */
export const verifyPassword = (hash: string, plaintext: string) =>
  argon2.verify(hash, plaintext.normalize());
