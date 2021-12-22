import dotenv from 'dotenv';
import path from 'path';

// Allow environment variables from a file for development.
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * Returns value stored in environment variable with the given 'name'.
 * Throws Error if no such variable or if variable undefined; thus ensuring that the variable exists.
 *
 * @param variable - A variable to check whether it exists or not.
 */
const env = (variable: string) => {
  if (!variable) {
    throw new Error(`Missing core environment variable: '${variable}'.`);
  }

  return variable;
};

/**
 * Transforms Base64 strings into ASCII.
 *
 * @param value - String value in Base64 format
 * @returns ASCII encoded string
 */
const fromBase64ToASCII = (value: string) =>
  Buffer.from(value, 'base64').toString('ascii');

/**
 * All configuration values of this application from the environment variables.
 */
const config = {
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'attendance-secret-cookie',
  DATABASE: env(process.env.DATABASE_URL),
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'attendance-users',
  JWT_ISSUER: process.env.JWT_ISSUER || 'attendance-api',
  JWT_PRIVATE_KEY: fromBase64ToASCII(env(process.env.JWT_PRIVATE_KEY)),
  JWT_PUBLIC_KEY: fromBase64ToASCII(env(process.env.JWT_PUBLIC_KEY)),
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
  TOTP_ISSUER: process.env.TOTP_ISSUER || 'Attendance',
};

export default Object.freeze(config);
