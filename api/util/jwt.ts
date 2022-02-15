import type { Request } from 'express';
import type { JWTHeaderParameters, JWTPayload, JWTVerifyOptions } from 'jose';
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from 'jose';

import config from '../config';
import isHTTPS from './is-https';

/**
 * Signs a JWT token with EdDSA algorithm, will transform the JWT into JWS.
 *
 * @param jti - Random JSON Token Identifier.
 * @param userID - A user ID.
 * @returns Signed JWS.
 */
export const signJWS = async (jti: string, userID: string) => {
  const privateKey = await importPKCS8(config.JWT_PRIVATE_KEY, 'EdDSA');

  const payload: JWTPayload = {
    aud: config.JWT_AUDIENCE,
    exp: Math.floor(Date.now() / 1000) + 900, // 15 minutes
    iat: Math.floor(Date.now() / 1000),
    iss: config.JWT_ISSUER,
    jti,
    nbf: Math.floor(Date.now() / 1000),
    sub: userID,
  };

  const headers: JWTHeaderParameters = {
    alg: 'EdDSA',
    typ: 'JWT',
  };

  return new SignJWT(payload).setProtectedHeader(headers).sign(privateKey);
};

/**
 * This function is used to verify the current token from user's cookie.
 * We will also check the supposed 'audience' and 'issuer'.
 *
 * @param token - JWT token
 * @returns A promise object that contains our JWT.
 */
export const verifyToken = async (token: string) => {
  const publicKey = await importSPKI(config.JWT_PUBLIC_KEY, 'EdDSA');

  const options: JWTVerifyOptions = {
    audience: config.JWT_AUDIENCE,
    issuer: config.JWT_ISSUER,
  };

  return jwtVerify(token, publicKey, options);
};

/**
 * Extracts a token from either Authorization header or signed cookie.
 * Will prioritize token from Authorization header.
 *
 * @param req - Express.js's request object.
 * @returns Extracted JWT token.
 */
export const extractJWT = (req: Request) => {
  const { authorization } = req.headers;

  if (authorization?.startsWith('Bearer ')) {
    return authorization.split(' ')[1];
  }

  // If using signed cookies, then add `__Host' prefix if applicable.
  if (isHTTPS(req)) {
    const cookie = `__Host-${config.JWT_COOKIE_NAME}`;
    return req.signedCookies[cookie];
  }

  return req.signedCookies[config.JWT_COOKIE_NAME];
};
