import argon2 from 'argon2';
import type { CookieOptions, NextFunction, Request, Response } from 'express';
import * as jose from 'jose';
import { nanoid } from 'nanoid/async';

import config from '../../config';
import { validateTOTP } from '../../core/rfc6238';
import { parseBasicAuth } from '../../core/rfc7617';
import AppError from '../../util/app-error';
import sendResponse from '../../util/send-response';
import CacheService from '../cache/service';
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

    // filter sensitive data
    const filteredUser = await UserService.getUserByID(user.userID);

    // set signed, secure session cookie
    req.session.userID = user.userID;
    req.session.userRole = user.role;

    // send response
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: filteredUser,
      message: 'Logged in successfully!',
      type: 'auth',
    });
  },

  /**
   * Logs out a single user from the webservice. Removes all related cookies.
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

      res.cookie('attendance-jws', 'loggedOut', { maxAge: 10 });

      sendResponse({
        req,
        res,
        status: 'success',
        statusCode: 200,
        data: [],
        message: 'Logged out successfully!',
        type: 'auth',
      });
    });
  },

  /**
   * Registers a user into the webservice. Exactly the same as 'createUser' in 'User' entity.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  register: async (req: Request, res: Response, next: NextFunction) => {
    if (await UserService.getUserByUsername(req.body.username)) {
      next(new AppError('This username has existed already!', 400));
      return;
    }

    if (await UserService.getUserByEmail(req.body.email)) {
      next(new AppError('This email has been used by another user!', 400));
      return;
    }

    if (await UserService.getUserByPhoneNumber(req.body.phoneNumber)) {
      next(
        new AppError('This phone number has been used by another user!', 400)
      );
      return;
    }

    const user = await UserService.createUser(req.body);

    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 201,
      data: user,
      message: 'Successfully registered to the webservice!',
      type: 'auth',
    });
  },

  /**
   * SendOTP sends an OTP to a user with this algorithm:
   * 1. Get user data from session.
   * 2. If user has asked for OTP beforehand, do not allow until the related KVS is expired.
   * 3. Choose from query string: phone, email, or authenticator. Default is authenticator.
   * 4. Generate TOTP using RFC 6238 algorithm with user-specific properties.
   * 5. If using authenticators, tell user to verify TOTP as soon as possible.
   * 6. Send TOTP to that media if applicable.
   * 7. Set 'hasAskedOTP' in cache to true.
   * 8. Wait for user to provide TOTP in 'verify' part of the endpoint.
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

    // if not yet expired, means that the user has asked in 'successive' order and it is a potential to spam
    if (await CacheService.getHasAskedOTP(uid)) {
      next(
        new AppError(
          'You have recently asked for an OTP. Please wait 30 seconds before we process your request again.',
          429
        )
      );
      return;
    }

    // guaranteed to be 'email', 'sms', or 'authenticator' due to the validation layer
    if (req.params.media === 'email') {
      // TODO: send email
    }

    if (req.params.media === 'sms') {
      // TODO: send sms
    }

    // if using authenticator, do nothing as its already there, increment redis instead
    await CacheService.setHasAskedOTP(uid);

    // send back response
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: [],
      message:
        'OTP has been processed. Please check your chosen media and verify the OTP there.',
      type: 'auth',
    });
  },

  /**
   * VerifyOTP verifies if a TOTP is valid or not valid. The algorithm:
   * 1. Parse 'Basic' authentication. Also check if the user is blocked or not (failed to input correct TOTP many times in successive order).
   * 2. Get user data from 'username' column of the authentication string.
   * 3. Pull the user's secret key from the database.
   * 4. Validate the user's TOTP. The input OTP will be fetched from the 'password' column of the authentication string.
   * 5. If the TOTP is valid, give back JWS token. This is the user's second session. If not valid, increment the 'TOTPAttempts' in cache.
   * 6. Take note of the JTI, store it inside Redis cache for statefulness.
   * 7. Send back response.
   *
   * Token gained from this function will act as a signed cookie that can be used to authenticate oneself.
   * Username is the user's ID. The password is the user's TOTP token.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  verifyOTP: async (req: Request, res: Response, next: NextFunction) => {
    // check headers
    if (!req.headers.authorization) {
      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('Missing authorization header!', 400));
      return;
    }

    // check whether authentication scheme is correct
    const { username, password } = parseBasicAuth(req.headers.authorization);
    if (!username || !password) {
      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('Invalid authentication scheme!', 401));
      return;
    }

    // check whether username exists
    const user = await UserService.getUserCompleteDataByID(username);
    if (!user) {
      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('User with that identifier is not found.', 401));
      return;
    }

    // if user has reached 3 times, then block attempt
    // TODO: should send email/sms/push notification to the relevant user
    const attempts = await CacheService.getOTPAttempts(user.userID);
    if (attempts && Number.parseInt(attempts, 10) === 3) {
      next(
        new AppError(
          'You have exceeded the times allowed for a secured session. Please try again in the next day.',
          429
        )
      );
      return;
    }

    // validate otp
    const validTOTP = validateTOTP(password, {
      issuer: config.TOTP_ISSUER,
      label: user.username,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: user.totpSecret,
    });
    if (!validTOTP) {
      await CacheService.setOTPAttempts(user.userID);

      res.set('WWW-Authenticate', 'Basic realm="OTP"');
      next(new AppError('Invalid authentication, wrong OTP code!', 401));
      return;
    }

    // generate JWS as the authorization ticket
    const jti = await nanoid();
    const token = await signJWS(jti, user.userID);

    // set otp session by JTI
    await CacheService.setOTPSession(jti, user.userID);

    // set cookie
    const options: CookieOptions = {
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'strict',
      maxAge: 900000, // 15 minutes
      signed: true,
    };
    res.cookie('attendance-jws', token, options);

    // send response
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: {
        token,
      },
      message:
        'OTP has been verified. Special session has been given to the current user.',
      type: 'auth',
    });
  },
};

export default AuthController;
