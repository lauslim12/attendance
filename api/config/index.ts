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
 * All configuration values of this application from the environment variables.
 */
const config = {
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'attendance-secret-cookie',
  DATABASE: env(process.env.DATABASE_URL),
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
  TOTP_ISSUER: process.env.TOTP_ISSUER || 'Attendance',
};

export default Object.freeze(config);
