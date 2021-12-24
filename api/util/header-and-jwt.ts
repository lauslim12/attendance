import * as jose from 'jose';

import config from '../config';

/**
 * Signs a JWT token with EdDSA algorithm, will transform the JWT into JWS.
 *
 * @param jti - Random JSON Token Identifier.
 * @param userID - A user ID.
 * @returns Signed JWS.
 */
export const signJWS = async (jti: string, userID: string) => {
  const privateKey = await jose.importPKCS8(config.JWT_PRIVATE_KEY, 'EdDSA');

  const payload: jose.JWTPayload = {
    aud: config.JWT_AUDIENCE,
    exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
    iat: Math.floor(Date.now() / 1000),
    iss: config.JWT_ISSUER,
    jti,
    nbf: Math.floor(Date.now() / 1000),
    sub: userID,
  };

  const headers: jose.JWTHeaderParameters = {
    alg: 'EdDSA',
    typ: 'JWT',
  };

  return new jose.SignJWT(payload).setProtectedHeader(headers).sign(privateKey);
};

/**
 * This function is used to verify the current token from user's cookie.
 * We will also check the supposed 'audience' and 'issuer'.
 *
 * @param token - JWT token
 * @returns A promise object that contains our JWT.
 */
export const verifyToken = async (token: string) => {
  const publicKey = await jose.importSPKI(config.JWT_PUBLIC_KEY, 'EdDSA');

  const options: jose.JWTVerifyOptions = {
    audience: config.JWT_AUDIENCE,
    issuer: config.JWT_ISSUER,
  };

  return jose.jwtVerify(token, publicKey, options);
};

/**
 * Extracts a token from either Authorization header or signed cookie.
 * Prioritize token from Authorization header.
 *
 * @param header - Authorization header value
 * @param signedCookie - Signed cookie if applicable
 * @returns Extracted JWT token
 */
export const extractToken = (
  header: string | undefined,
  signedCookie: string | undefined
) => {
  if (header && header.startsWith('Bearer ')) {
    return header.split(' ')[1];
  }

  return signedCookie;
};
