import * as OTPAuth from 'otpauth';

import config from '../config';
import safeCompare from '../util/safe-compare';
import { b32FromBuf, b32ToBuf } from './util/base32';
import hmacDigest from './util/hmac-digest';
import numberToBuf from './util/number-to-buf';
import pad from './util/pad';

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

  // Allow delta up to 2 (technically 90 seconds) in time drift.
  const delta = totp.validate({ token, window: 2 });
  if (delta === null) {
    return false;
  }

  if (delta < -2) {
    return false;
  }

  return true;
};

/**
 * Validates whether an OTP is correct or not correct.
 * Accepts a window of two time steps, as recommended by RFC 6238 specifications.
 *
 * @param token - TOTP token.
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

  const delta = totp.validate({ token, window: 2 });
  if (delta === null) {
    return false;
  }

  if (delta < -2) {
    return false;
  }

  return true;
};

/**
 * Generates own TOTP with handwritten algorithm to be tested against the library one, to show
 * a deeper understanding of the subject.
 *
 * @param counter - The counter to calculate the value of the TOTP. Usually in the form of `Date.now() / 1000 / period`.
 * @param params - OTP parameters.
 * @returns OTP and Authenticator URI.
 */
export const generateOwnOTP = (
  counter: number,
  { issuer, label, algorithm, digits, period, secret }: OTPParams
) => {
  // Ensure that current time is correct according to the algorithm.
  const b32Secret = b32ToBuf(b32FromBuf(Buffer.from(secret)));
  const epoch = numberToBuf(counter);

  // Perform HMAC digest, calculate offset, and perform dynamic truncation.
  const digest = new Uint8Array(hmacDigest(algorithm, b32Secret, epoch));
  const offset = digest[digest.byteLength - 1] & 15;
  const otp =
    (((digest[offset] & 127) << 24) |
      ((digest[offset + 1] & 255) << 16) |
      ((digest[offset + 2] & 255) << 8) |
      (digest[offset + 3] & 255)) %
    10 ** digits;

  // TOTP is padded with zeroes if necessary.
  const token = pad(otp, digits);
  const uri = `otpauth://totp/${issuer}:${label}?issuer=${issuer}&secret=${secret}&algorithm=${algorithm}&digits=${digits}&period=${period}`;

  // Return same objects as the usual methods.
  return { token, uri };
};

/**
 * Verifies my own TOTP with handwritten algorithm that conforms to RFC 6238 instead of
 * using libraries to show a more in-depth understanding of the subject.
 *
 * @param otp - TOTP token.
 * @param window - Periods in which the OTP should be considered 'still valid'.
 * @param params - Object consisting of the `issuer`, `label`, `algorithm`, `digits`, `period`, and `secret`.
 * @returns Boolean value whether the OTP is valid or not.
 */
export const verifyOwnTOTP = (
  otp: string,
  window: number,
  { issuer, label, algorithm, digits, period, secret }: OTPParams
) => {
  // If token does not match the `digits` parameter, return.
  if (otp.length !== digits) {
    return undefined;
  }

  // Provide default values and encodings.
  const counter = Math.floor(Date.now() / 1000 / period);

  // Generate TOTP and use the proper window for verification.
  for (let i = counter - window; i <= counter + window; i += 1) {
    const generatedOTP = generateOwnOTP(i, {
      issuer,
      label,
      algorithm,
      digits,
      period,
      secret,
    }).token;

    if (safeCompare(otp, generatedOTP)) {
      return true;
    }
  }

  // Return false if token does not match.
  return false;
};
