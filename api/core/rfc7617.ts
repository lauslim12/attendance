/**
 * Creates a Basic Authorization string based on RFC 7617. This function
 * is unused, but is left here for the sake of completeness, as the one who will process
 * the creation of the authorization string will be at the front-end part of the application.
 *
 * {@link https://datatracker.ietf.org/doc/html/rfc7617}
 * @param username - A username.
 * @param password - A password.
 * @returns Basic authorization string.
 */
export const createBasicAuth = (username: string, password: string) => {
  const encoded = Buffer.from(`${username}:${password}`).toString('base64');

  return `Basic ${encoded}`;
};

/**
 * Parses a Basic Authorization string based on RFC 7617 specifications. This function
 * will not choke if a password contains the `:` character, but obviously the username
 * could not contain the `:` character. In this function, `identifier`, `userID`, and `username`
 * are all identical names.
 *
 * {@link https://datatracker.ietf.org/doc/html/rfc7617}
 * @param auth - Authorization string, encoded in Base64 format.
 * @returns An object containing the decoded plaintext username and password to be processed further.
 */
export const parseBasicAuth = (auth: string) => {
  // Attempt to validate the content of the authorization header. Intentional whitespace
  // to ensure the `credentials` variable only consists of the encoded authorization string.
  const [, credentials] = auth.split('Basic ');
  if (!credentials) {
    throw new TypeError('parseBasicAuth: Invalid Basic authentication scheme!');
  }

  // Decode credentials. Will not choke if password contains the `:` character.
  // Separator is to get the position of the first `:` character.
  const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
  const separator = decoded.indexOf(':');

  // Invalid authentication scheme if the code does not find the `:` character.
  if (separator === -1) {
    throw new TypeError('parseBasicAuth: Invalid Basic authentication scheme!');
  }

  // Take username and password from the decoded credentials.
  const username = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  // Return as an object.
  return { username, password };
};
