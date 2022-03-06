/**
 * This function is used to transform base-32 encoded string into bytes.
 *
 * @link http://web.cecs.pdx.edu/~harry/compilers/ASCIIChart.pdf
 * @link https://github.com/LinusU/base32-decode
 * @param str - Base32-encoded string.
 * @returns ArrayBuffer consists of the 'bytes' version of the parameter.
 */
export const b32ToBuf = (str: string) => {
  // Canonicalize to all upper case and remove padding if it exists.
  str = str.toUpperCase().replace(/=+$/, '');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const buf = new ArrayBuffer(((str.length * 5) / 8) | 0);
  const arr = new Uint8Array(buf);

  let bits = 0;
  let value = 0;
  let index = 0;

  for (let i = 0; i < str.length; i++) {
    const idx = alphabet.indexOf(str[i]);
    if (idx === -1)
      throw new TypeError(`b32ToBuf: Invalid character found: ${str[i]}.`);

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      arr[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return buf;
};

/**
 * Converts an ArrayBuffer to a base32 string (RFC 4648) with padding.
 * Alphabet conforms to Base32 alphabets.
 *
 * @link https://github.com/LinusU/base32-encode
 * @param buf - ArrayBuffer representation of a string.
 * @returns Base32 string.
 */
export const b32FromBuf = (buf: ArrayBuffer) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const arr = new Uint8Array(buf);

  let bits = 0;
  let value = 0;
  let str = '';

  for (let i = 0; i < arr.length; i++) {
    value = (value << 8) | arr[i];
    bits += 8;

    while (bits >= 5) {
      str += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    str += alphabet[(value << (5 - bits)) & 31];
  }

  while (str.length % 8 !== 0) {
    str += '=';
  }

  return str;
};
