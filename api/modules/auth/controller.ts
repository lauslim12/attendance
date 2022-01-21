import type { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid/async';

import config from '../../config';
import { generateDefaultTOTP, validateDefaultTOTP } from '../../core/rfc6238';
import { parseBasicAuth } from '../../core/rfc7617';
import AppError from '../../util/app-error';
import getDeviceID from '../../util/device-id';
import { extractToken, signJWS, verifyToken } from '../../util/header-and-jwt';
import { verifyPassword } from '../../util/passwords';
import safeCompare from '../../util/safe-compare';
import sendResponse from '../../util/send-response';
import CacheService from '../cache/service';
import Email from '../email';
import UserService from '../user/service';

/**
 * Sends the user's authentication status to the client in the form of JSON response.
 * The 'type' of the response is authentication, as this one does not really
 * fit with the 'users' type.
 *
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 * @param isAuthenticated - Boolean value whether the user is authenticated or not.
 * @param isMFA - Boolean value whether the user is on secure session or not.
 */
const sendUserStatus = (
  req: Request,
  res: Response,
  isAuthenticated: boolean,
  isMFA: boolean
) => {
  sendResponse({
    req,
    res,
    status: 'success',
    statusCode: 200,
    data: { isAuthenticated, isMFA },
    message: "Successfully fetched the user's status!",
    type: 'auth',
  });
};

/**
 * Authentication controller, forwarded from 'handler'.
 */
const AuthController = {
  /**
   * Gets the user's status (is normally authenticated and is MFA authenticated). The authentication
   * process is similar to the ones in 'has-session.ts' and 'has-jwt.ts'.
   * This is a special middleware. It should have no 'next', and this middleware
   * will ignore ANY errors that might be in the way. If an error is found, the user
   * will not be authenticated and will not throw an 'AppError'.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   */
  getStatus: async (req: Request, res: Response) => {
    try {
      // Check session.
      if (!req.session.userID) {
        sendUserStatus(req, res, false, false);
        return;
      }

      // Make sure that the user exists in the database.
      const user = await UserService.getUser({ userID: req.session.userID });
      if (!user) {
        sendUserStatus(req, res, false, false);
        return;
      }

      // Make sure that the user is not blocked.
      if (!user.isActive) {
        sendUserStatus(req, res, false, false);
        return;
      }

      // Extract token and validate.
      const token = extractToken(
        req.headers.authorization,
        req.signedCookies['attendance-jws']
      );
      if (!token) {
        sendUserStatus(req, res, true, false);
        return;
      }

      // Verify token.
      const decoded = await verifyToken(token);

      // Verify JTI.
      if (!decoded.payload.jti) {
        sendUserStatus(req, res, true, false);
        return;
      }

      // Checks whether JTI exists or not in the cache.
      const userID = await CacheService.getOTPSession(decoded.payload.jti);
      if (!userID) {
        sendUserStatus(req, res, true, false);
        return;
      }

      // Check if JTI is equal to the current session, and ensure that the subject
      // is equal to the user ID as well.
      if (req.session.userID !== userID || decoded.payload.sub !== userID) {
        sendUserStatus(req, res, true, false);
      }

      // Send final response that the user is properly authenticated and authorized.
      sendUserStatus(req, res, true, true);
    } catch {
      sendUserStatus(req, res, false, false);
    }
  },

  /**
   * Logs in a user into the webservice.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  login: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    // Safe compare usernames.
    const user = await UserService.getUserComplete({ username });
    if (!user) {
      next(new AppError('Invalid username and/or password!', 401));
      return;
    }

    // Safe compare passwords.
    const passwordMatch = await verifyPassword(user.password, password);
    if (!passwordMatch) {
      next(new AppError('Invalid username and/or password!', 401));
      return;
    }

    // Ensure the user is not blocked.
    if (!user.isActive) {
      next(new AppError('User is not active. Please contact the admin.', 403));
      return;
    }

    // Clone object and delete sensitive data, prevent leaking confidential information. Do
    // not perform DB calls here - it is unnecessary overhead.
    const filteredUser = { ...user } as Partial<typeof user>;
    delete filteredUser.totpSecret;
    delete filteredUser.password;
    delete filteredUser.userPK;

    // Re-generate session to prevent multiple users sharing one session ID.
    req.session.regenerate((err) => {
      if (err) {
        next(new AppError('Failed to initialize a secure session.', 500));
      }

      // Set signed cookies with session information.
      req.session.userID = user.userID;
      req.session.userRole = user.role;
      req.session.lastActive = Date.now().toString();
      req.session.sessionInfo = getDeviceID(req);
      req.session.signedIn = Date.now().toString();

      // Remove MFA session cookie if it exists.
      res.cookie(config.JWT_COOKIE_NAME, 'loggedOut', { maxAge: 10 });

      // Send response.
      sendResponse({
        req,
        res,
        status: 'success',
        statusCode: 200,
        data: filteredUser,
        message: 'Logged in successfully!',
        type: 'auth',
      });
    });
  },

  /**
   * Logs out a single user from the webservice. Removes all related cookies.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  logout: (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
      if (err) {
        next(new AppError('Failed to log out. Please try again later.', 500));
        return;
      }

      res.cookie(config.JWT_COOKIE_NAME, 'loggedOut', { maxAge: 10 });

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
   * Registers a user into the webservice. Exactly the same as 'createUser' in 'User' entity,
   * with same validations as in 'createUser'.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  register: async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, phoneNumber, password, fullName } = req.body;

    // Validates whether the username or email or phone is already used or not. Use
    // parallel processing for speed.
    const [userByUsername, userByEmail, userByPhone] = await Promise.all([
      UserService.getUser({ username }),
      UserService.getUser({ email }),
      UserService.getUser({ phoneNumber }),
    ]);

    // Perform checks and validations.
    if (userByUsername) {
      next(new AppError('This username has existed already!', 422));
      return;
    }

    if (userByEmail) {
      next(new AppError('This email has been used by another user!', 422));
      return;
    }

    if (userByPhone) {
      next(
        new AppError('This phone number has been used by another user!', 422)
      );
      return;
    }

    const user = await UserService.createUser({
      username,
      email,
      phoneNumber,
      password,
      totpSecret: '', // kept blank to ensure that this gets filled in the service layer
      fullName,
    });

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
   * - Get user data from session.
   * - If user has asked for OTP beforehand, do not allow until the related KVS is expired.
   * - Choose from query string: phone, email, or authenticator. Default is authenticator.
   * - Generate TOTP using RFC 6238 algorithm with user-specific properties.
   * - If using authenticators, tell user to verify TOTP as soon as possible.
   * - Send TOTP to that media if applicable.
   * - Set 'hasAskedOTP' in cache to true.
   * - Wait for user to provide TOTP in 'verify' part of the endpoint.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  sendOTP: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.session;

    if (!userID) {
      next(new AppError('No session detected. Please log in again.', 401));
      return;
    }

    // Check the availability of the user.
    const user = await UserService.getUserComplete({ userID });
    if (!user) {
      next(new AppError('User with this ID does not exist!', 404));
      return;
    }

    // If not yet expired, means that the user has asked in 'successive' order and it is a potential to spam.
    if (await CacheService.getHasAskedOTP(userID)) {
      next(
        new AppError(
          'You have recently asked for an OTP. Please wait 30 seconds before we process your request again.',
          429
        )
      );
      return;
    }

    // Guaranteed to be 'email', 'sms', or 'authenticator' due to the validation layer.
    const totp = generateDefaultTOTP(user.username, user.totpSecret);
    if (req.query.media === 'email') {
      await new Email(user.email, user.fullName).sendOTP(totp.token);
    }

    // TODO: send SMS
    if (req.query.media === 'sms') {
      next(
        new AppError(
          'Media is not yet implemented. Please use another media.',
          501
        )
      );
      return;
    }

    // If using authenticator, do nothing as its already there, increment redis instead.
    await CacheService.setHasAskedOTP(userID);

    // Send back response.
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
   * Updates a password for the currently logged in user.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  updatePassword: async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { userID } = req.session;

    if (!userID) {
      next(new AppError('No session detected. Please log in again.', 401));
      return;
    }

    // Fetch old data.
    const user = await UserService.getUserComplete({ userID });
    if (!user) {
      next(new AppError('There is no user with that ID.', 404));
      return;
    }

    // Compare old passwords.
    const passwordsMatch = await verifyPassword(user.password, currentPassword);
    if (passwordsMatch) {
      next(new AppError('Your previous password is wrong!', 401));
      return;
    }

    // Confirm passwords. We have no need to use safe-compare in this one.
    if (!safeCompare(newPassword, confirmPassword)) {
      next(new AppError('Your new passwords do not match.', 401));
      return;
    }

    // Update new password.
    await UserService.updateUser({ userID }, { password: newPassword });

    // Destroy all sessons for this current user.
    req.session.destroy(async (err) => {
      if (err) {
        next(
          new AppError('Failed to destroy session. Please contact admin.', 500)
        );
        return;
      }

      // Delete all of the sessions. We use 'user.userID' as 'req.session.userID'
      // is not accessible anymore (already deleted in this callback).
      await CacheService.deleteUserSessions(user.userID);

      // Send back response.
      sendResponse({
        req,
        res,
        status: 'success',
        statusCode: 200,
        data: [],
        message: 'Successfully changed passwords. Please log in again!',
        type: 'auth',
      });
    });
  },

  /**
   * VerifyOTP verifies if a TOTP is valid or not valid. The algorithm:
   * - Parse 'Basic' authentication. Also check if the user is blocked or not (failed to input correct TOTP many times in successive order).
   * - If the user is blocked, send email / notification to the user.
   * - Get user data from 'username' column of the authentication string.
   * - Pull the user's secret key from the database.
   * - Validate the user's TOTP. The input OTP will be fetched from the 'password' column of the authentication string.
   * - If the TOTP is valid, give back JWS token. This is the user's second session. If not valid, increment the 'TOTPAttempts' in cache.
   * - Take note of the JTI, store it inside Redis cache for statefulness.
   * - Send back response.
   *
   * Token gained from this function will act as a signed cookie that can be used to authenticate oneself.
   * Username is the user's ID. The password is the user's TOTP token.
   *
   * @param req - Express.js's request object.
   * @param res - Express.js's response object.
   * @param next - Express.js's next function.
   */
  verifyOTP: async (req: Request, res: Response, next: NextFunction) => {
    // Validate header.
    if (!req.headers.authorization) {
      next(new AppError('Missing authorization header!', 400));
      return;
    }

    // Check whether authentication scheme is correct.
    const { username, password } = parseBasicAuth(req.headers.authorization);
    if (!username || !password) {
      next(new AppError('Invalid authentication scheme!', 400));
      return;
    }

    // Check whether username exists.
    const user = await UserService.getUserComplete({ userID: username });
    if (!user) {
      next(new AppError('User with that identifier is not found.', 404));
      return;
    }

    // If user has reached 3 times, then block the user's attempt.
    // Send response first BEFORE sending the email for performance.
    // TODO: should send email/sms/push notification to the relevant user
    const attempts = await CacheService.getOTPAttempts(user.userID);
    if (attempts && Number.parseInt(attempts, 10) === 3) {
      next(
        new AppError(
          'You have exceeded the number of times allowed for a secured session. Please try again in the next day.',
          429
        )
      );

      await new Email(user.email, user.fullName).sendNotification();
      return;
    }

    // Ensures that OTP has never been used before.
    const usedOTP = await CacheService.getBlacklistedOTP(password);
    if (usedOTP) {
      await CacheService.setOTPAttempts(user.userID);
      next(new AppError('This OTP has expired.', 410));
      return;
    }

    // Validate OTP.
    const validTOTP = validateDefaultTOTP(password, user.totpSecret);
    if (!validTOTP) {
      await CacheService.setOTPAttempts(user.userID);
      next(new AppError('Invalid authentication, wrong OTP code.', 401));
      return;
    }

    // Make sure to blacklist the TOTP (according to the specs).
    await CacheService.blacklistOTP(password);

    // Generate JWS as the authorization ticket.
    const jti = await nanoid();
    const token = await signJWS(jti, user.userID);

    // Set OTP session by its JTI.
    await CacheService.setOTPSession(jti, user.userID);

    // Set cookie for the JWS.
    res.cookie(config.JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'strict',
      maxAge: 900000, // 15 minutes
      signed: true,
    });

    // Send response.
    sendResponse({
      req,
      res,
      status: 'success',
      statusCode: 200,
      data: {
        token,
      },
      message: 'OTP verified. Special session has been given to the user.',
      type: 'auth',
    });
  },
};

export default AuthController;
