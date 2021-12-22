import argon2 from 'argon2';
import type { NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { nanoid } from 'nanoid/async';

import config from '../../config';
import { validateTOTP } from '../../core/rfc6238';
import { parseBasicAuth } from '../../core/rfc7617';
import redis from '../../infra/redis';
import AppError from '../../util/app-error';
import UserService from '../user/service';

/**
 * Signs a JWT token with EdDSA algorithm, will transform the JWT into JWS.
 *
 * @param jti - Random JSON Token Identifier.
 * @param userID - A user ID.
 * @returns Signed JWS.
 */
const signJWS = async (jti: string, userID: string) => {
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
 * Authentication controller, forwarded from 'handler'.
 */
const AuthController = {
  /**
   * Logs in a user into the webservice.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  login: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // compare usernames
    const user = await UserService.getUserCompleteDataByUsername(username);
    if (!user) {
      next(new AppError('Invalid username and/or password!', 401));
      return;
    }

    // compare passwords
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      next(new AppError('Invalid username and/or password!', 401));
      return;
    }

    // set signed, secure session cookie
    req.session.userID = user.userID;

    // send response
    res.status(200).json({
      status: 'success',
      message: 'Logged in succesfully!',
    });
  },

  /**
   * Logs out a single user from the webservice.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  logout: async (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
      if (err) {
        next(new AppError('Failed to log out. Please try again later.', 500));
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully!',
      });
    });
  },

  /**
   * SendOTP sends an OTP to a user with this algorithm:
   * 1. Get user data from session.
   * 2. Choose from query string: phone, email, or authenticator. Default is authenticator.
   * 3. Generate TOTP using RFC 6238 algorithm with user-specific properties.
   * 4. If using authenticators, tell user to verify TOTP as soon as possible.
   * 5. Send TOTP to that media if applicable.
   * 6. Wait for user to provide TOTP in 'verify' part of the endpoint.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  sendOTP: async (req: Request, res: Response, next: NextFunction) => {
    const uid = req.session.userID;
    if (!uid) {
      next(new AppError('No session detected. Please log in again.', 401));
      return;
    }

    // guaranteed to exist and be 'email', 'sms', 'media' due to validation layer
    if (req.params.media === 'email') {
      // send email
    }

    if (req.params.media === 'sms') {
      // send sms
    }

    // default is authenticator
    res.status(200).json({
      status: 'success',
      message:
        'OTP processed. Please check your chosen media and verify the OTP there.',
    });
  },

  /**
   * VerifyOTP verifies if a TOTP is valid or not valid. The algorithm:
   * 1. Parse 'Basic' authentication.
   * 2. Get user data from 'username' column of the authentication string.
   * 3. Pull the user's secret key from the database.
   * 4. Validate the user's TOTP. The input OTP will be fetched from the 'password' column of the authentication string.
   * 5. If the TOTP is valid, give back JWS token. This is the user's second session.
   * 6. Take note of the JTI, store it inside Redis cache for statefulness.
   * 7. Send back response.
   *
   * Token gained from this function will act as a signed cookie that can be used to authenticate oneself.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  verifyOTP: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('Missing authorization header!', 400));
      return;
    }

    const { username, password } = parseBasicAuth(req.headers.authorization);
    if (!username || !password) {
      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('Invalid authentication scheme!', 401));
      return;
    }

    const user = await UserService.getUserCompleteDataByUsername(username);
    if (!user) {
      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('User with that identifier is not found.', 401));
      return;
    }

    const validTOTP = validateTOTP(password, {
      issuer: config.TOTP_ISSUER,
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.totpSecret,
    });
    if (!validTOTP) {
      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('Invalid authentication, wrong OTP code!', 401));
      return;
    }

    // generate JWS here
    const jti = await nanoid();
    const token = await signJWS(jti, user.userID);
    await redis.setex(`otp-sess:${jti}`, 900, user.userID);

    // set cookie and response
    res
      .cookie('attendance-jws', token, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 900000, // 15 minutes
        signed: true,
      })
      .status(200)
      .json({
        status: 'success',
        message: 'OTP has been verified, special session given.',
      });
  },
};

export default AuthController;
