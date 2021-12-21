import * as OTPAuth from 'otpauth';

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
 * Generates a TOTP based on the given parameters.
 * TOTP conforms to RFC 6238.
 *
 * @param params - Object consisting of the `issuer`, `label`, `algorithm`, `digits`, `period`, and `secret`.
 * @returns An object consisting of the TOTP and the TOTP Authenticator URI.
 */
const generateTOTP = ({
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
 * Validates whether an OTP is correct or not correct.
 * Accepts a window of two time steps, as recommended by RFC 6238 specifications.
 *
 * @param token - TOTP token
 * @param params - Object consisting of the `issuer`, `label`, `algorithm`, `digits`, `period`, and `secret`.
 * @returns Boolean value whether the OTP is valid or not.
 */
const validateTOTP = (
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

export { generateTOTP, validateTOTP };
