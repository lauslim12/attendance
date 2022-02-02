import crypto from 'node:crypto';

/**
 * Generates a private key and a public key.
 *
 * @returns Array consisting of a public key and private key in string / buffer.
 */
function generateKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');

  return [
    publicKey.export({ type: 'spki', format: 'pem' }),
    privateKey.export({ type: 'pkcs8', format: 'pem' }),
  ];
}

/**
 * Transforms public keys and private keys into Base64 format for storage as environment variables.
 *
 * @param publicKey - A public key
 * @param privateKey - A private key
 * @returns An array of Base-64 encoded keys
 */
function convertKeys(publicKey: string | Buffer, privateKey: string | Buffer) {
  const base64PublicKey = Buffer.from(publicKey).toString('base64');
  const base64PrivateKey = Buffer.from(privateKey).toString('base64');

  return [base64PublicKey, base64PrivateKey];
}

/**
 * Generates keys and transforms them.
 */
function main() {
  const [publicKey, privateKey] = generateKeys();
  const [b64PublicKey, b64PrivateKey] = convertKeys(publicKey, privateKey);

  console.log('');
  console.log('Successfully generated JWS keys in Base-64 format as follows:');
  console.log(`Public key in Base-64 format: ${b64PublicKey}.`);
  console.log(`Private key in Base-64 format: ${b64PrivateKey}.`);
  console.log(
    "Copy and set these keys as environment variables for 'JWT_PUBLIC_KEY' and 'JWT_PRIVATE_KEY'."
  );
}

/**
 * Simulates 'function main()' in most programming languages.
 */
main();
