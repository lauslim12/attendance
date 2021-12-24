/**
 * This function will pad a string with leading zeroes.
 *
 * Algorithm:
 * 1. Find how many times the loop should repeat if digits is more than the length of the string.
 *
 * @param num - Number of the OTP.
 * @param digits - Digits of the OTP.
 * @returns The TOTP.
 */
const pad = (num: number, digits: number) => {
  let prefix = '';
  let repeat = digits - String(num).length;

  while (repeat-- > 0) {
    prefix += '0';
  }

  return `${prefix}${num}`;
};

export default pad;
