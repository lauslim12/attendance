/**
 * Transforms a number to 'byte' array.
 * Remember that 'byte' array is just a 'hexadecimal number split by whitespaces if console logged'.
 *
 * Algorithm:
 * 1. Represent our input as 8-bytes array, can be done with ArrayBuffer.
 * 2. Buffer starts from the right, so we read backwards.
 * 3. Will return a result in 'bytes'.
 *
 * @param num - Number to be transformed into bytes.
 * @returns ArrayBuffer consists of numbers.
 */
const numberToBuf = (num: number) => {
  const buf = new ArrayBuffer(8);
  const arr = new Uint8Array(buf);
  let acc = num;

  // There's only 8 'locations' in an array of size 8. Array starts from zero.
  for (let i = 7; i >= 0; i--) {
    if (acc === 0) break;

    // We take the last 8 bits of the integer (we want it to be unsigned so it can fill the 'Uint8Array').
    // This is the same as force-casting in other languages: (byte) someInteger...
    // Divide by '256' to reduce the number (1 byte = 256).
    arr[i] = acc & 255;
    acc -= arr[i];
    acc /= 256;
  }

  return buf;
};

export default numberToBuf;
