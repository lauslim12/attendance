import argon2 from 'argon2';

/**
 * Asynchronously hashes a user's password with Argon2 algorithm.
 *
 * @param password - User's password.
 * @returns Argon2 hashed password.
 */
export const hashPassword = (password: string) =>
  argon2.hash(password.normalize(), { timeCost: 200, hashLength: 50 });

/**
 * Verifies 'Argon2' hash and its plaintext variant.
 *
 * @param hash - Hash form of the password.
 * @param plaintext - Plaintext form of the password.
 * @returns Boolean value whether the password is correct or not.
 */
export const verifyPassword = (hash: string, plaintext: string) =>
  argon2.verify(hash, plaintext.normalize(), { timeCost: 200, hashLength: 50 });
