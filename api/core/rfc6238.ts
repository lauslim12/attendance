import * as OTPAuth from 'otpauth';

import config from '../config';
import { b32FromBuf } from './util/base32';

/**
 * Collection of parameters to generate and validate a TOTP.
 */
type OTPParams = {
  issuer: string;
  label: string;
  algorithm: 'SHA1' | 'SHA256' | 'SHA512';
  digits: number;
  period: number;
  secret: string;
};

/**
 * Generates a default TOTP that is compatible with Authenticator apps.
 * Default TOTP is the TOTP that is used in this application.
 *
 * @param label - Label of this TOTP. Who is this TOTP for?
 * @param secret - The user's secret.
 * @returns An object consisting of the TOTP and the TOTP Authenticator URI.
 */
export const generateDefaultTOTP = (label: string, secret: string) => {
  const otpSecret = OTPAuth.Secret.fromBase32(b32FromBuf(Buffer.from(secret)));
  const totp = new OTPAuth.TOTP({
    issuer: config.TOTP_ISSUER,
    label,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: otpSecret,
  });

  return { token: totp.generate(), uri: totp.toString() };
};

/**
 * Generates a TOTP based on the given parameters.
 * TOTP conforms to RFC 6238.
 *
 * @param params - Object consisting of the `issuer`, `label`, `algorithm`, `digits`, `period`, and `secret`.
 * @returns An object consisting of the TOTP and the TOTP Authenticator URI.
 */
export const generateTOTP = ({
  issuer,
  label,
  algorithm,
  digits,
  period,
  secret,
}: OTPParams) => {
  const otpSecret = OTPAuth.Secret.fromBase32(b32FromBuf(Buffer.from(secret)));
  const totp = new OTPAuth.TOTP({
    issuer,
    label,
    algorithm,
    digits,
    period,
    secret: otpSecret,
  });

  return { token: totp.generate(), uri: totp.toString() };
};

/**
 * Validates whether a TOTP is correct or not based on default parameters that is used in this app.
 *
 * @param token - TOTP token.
 * @param secret - The user's secret.
 * @returns Boolean value whether the OTP is valid or not.
 */
export const validateDefaultTOTP = (token: string, secret: string) => {
  const otpSecret = OTPAuth.Secret.fromBase32(b32FromBuf(Buffer.from(secret)));
  const totp = new OTPAuth.TOTP({
    issuer: config.TOTP_ISSUER,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: otpSecret,
  });

  const delta = totp.validate({ token, window: 1 });
  if (delta === null) {
    return false;
  }

  if (!(delta >= 1) && !(delta <= 1)) {
    return false;
  }

  return true;
};

/**
 * Validates whether an OTP is correct or not correct.
 * Accepts a window of two time steps, as recommended by RFC 6238 specifications.
 *
 * @param token - TOTP token
 * @param params - Object consisting of the `issuer`, `label`, `algorithm`, `digits`, `period`, and `secret`.
 * @returns Boolean value whether the OTP is valid or not.
 */
export const validateTOTP = (
  token: string,
  { issuer, label, algorithm, digits, period, secret }: OTPParams
) => {
  const otpSecret = OTPAuth.Secret.fromBase32(b32FromBuf(Buffer.from(secret)));
  const totp = new OTPAuth.TOTP({
    issuer,
    label,
    algorithm,
    digits,
    period,
    secret: otpSecret,
  });

  const delta = totp.validate({ token, window: 1 });
  if (delta === null) {
    return false;
  }

  if (!(delta >= -1) && !(delta <= 1)) {
    return false;
  }

  return true;
};
