/**
 * Creates a Basic Authorization string based on RFC 7617.
 *
 * @param username - A username.
 * @param password - A password.
 * @returns Basic authorization string.
 */
export const createBasicAuth = (username: string, password: string) => {
  const encoded = Buffer.from(`${username}:${password}`).toString('base64');

  return `Basic ${encoded}`;
};

/**
 * Parses a Basic Authorization string based on RFC 7617 specifications.
 *
 * @param auth - Authorization string, encoded in Base-64.
 * @returns Parsed, plaintext username and password to be processed further.
 */
export const parseBasicAuth = (auth: string) => {
  const [, strippedHeader] = auth.split('Basic ');
  if (!strippedHeader)
    throw new TypeError('parseBasicAuth: Invalid Basic authentication scheme!');

  const [username, password] = Buffer.from(strippedHeader, 'base64')
    .toString('utf-8')
    .split(':');

  return { username, password };
};
