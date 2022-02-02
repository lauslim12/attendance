import dotenv from 'dotenv';
import { get } from 'env-var';
import path from 'path';

// Allow environment variables from a file for development.
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * Helper function to check whether the server is in production mode or not to
 * configure the proper environment variables.
 *
 * @returns Boolean value whether the server is in production mode or not.
 */
const isProduction = () => process.env.NODE_ENV === 'production';

/**
 * All configuration values of this application from the environment variables.
 * Intentionally spaced so it is easier to read and find out what is related with what.
 */
const config = {
  // Cookie.
  COOKIE_SECRET: get('COOKIE_SECRET')
    .default('attendance-secret-cookie')
    .asString(),

  // Databases.
  DATABASE: get('DATABASE_URL').required().asString(),

  // Emails.
  EMAIL_FROM: get('EMAIL_FROM').required(isProduction()).asString(),
  EMAIL_HOST: get('EMAIL_HOST').required(isProduction()).asString(),
  EMAIL_USERNAME: get('EMAIL_USERNAME').required(isProduction()).asString(),
  EMAIL_PASSWORD: get('EMAIL_PASSWORD').required(isProduction()).asString(),
  EMAIL_PORT: get('EMAIL_PORT').default(465).asPortNumber(),

  // JWT tokens for second session.
  JWT_AUDIENCE: get('JWT_AUDIENCE').default('attendance-users').asString(),
  JWT_COOKIE_NAME: get('JWT_COOKIE_NAME').default('attendance-jws').asString(),
  JWT_ISSUER: get('JWT_ISSUER').default('attendance-api').asString(),
  JWT_PRIVATE_KEY: get('JWT_PRIVATE_KEY')
    .required()
    .convertFromBase64()
    .asString(),
  JWT_PUBLIC_KEY: get('JWT_PUBLIC_KEY')
    .required()
    .convertFromBase64()
    .asString(),

  // Mailtrap: emails for development.
  MAILTRAP_HOST: get('MAILTRAP_HOST').required(!isProduction()).asString(),
  MAILTRAP_USERNAME: get('MAILTRAP_USERNAME')
    .required(!isProduction())
    .asString(),
  MAILTRAP_PASSWORD: get('MAILTRAP_PASSWORD')
    .required(!isProduction())
    .asString(),

  // Environment.
  NODE_ENV: get('NODE_ENV')
    .default('development')
    .asEnum(['development', 'production']),

  // Redis.
  REDIS_HOST: get('REDIS_HOST').required().asString(),
  REDIS_PASSWORD: get('REDIS_PASSWORD').default('').asString(),
  REDIS_PORT: get('REDIS_PORT').required().asString(),

  // Ports.
  PORT: get('PORT').default(8080).asPortNumber(),

  // Session cookie name.
  SESSION_COOKIE: get('SESSION_COOKIE').default('attendance-sid').asString(),

  // Issuer of the TOTP.
  TOTP_ISSUER: get('TOTP_ISSUER').default('Attendance').asString(),
};

export default Object.freeze(config);
