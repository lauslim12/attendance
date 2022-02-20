import CacheRepository from './repository';

/**
 * All services in Redis / cache are performed here.
 */
const CacheService = {
  /**
   * Blacklists an OTP using Redis.
   *
   * @param otp - One time password.
   * @returns Asynchronous number from Redis.
   */
  blacklistOTP: async (otp: string) => CacheRepository.blacklistOTP(otp),

  /**
   * Deletes a single session from the cache.
   *
   * @param sessionID - Session ID.
   * @returns Asynchronous number from Redis.
   */
  deleteSession: async (sessionID: string) =>
    CacheRepository.deleteSession(sessionID),

  /**
   * Deletes all sessions related to a User ID.
   *
   * @param userID - User ID.
   * @returns Asynchronous numbers from Redis.
   */
  deleteUserSessions: async (userID: string) =>
    CacheRepository.deleteUserSessions(userID),

  /**
   * Gets an OTP from the Redis cache in order to know whether it is blacklisted or not.
   *
   * @param otp - One time password.
   * @returns The OTP, or null.
   */
  getBlacklistedOTP: async (otp: string) =>
    CacheRepository.getBlacklistedOTP(otp),

  /**
   * Gets the total number of times the user tries to reset their password.
   *
   * @param userID - User ID.
   * @returns Number of attempts the user tried to reset their password.
   */
  getForgotPasswordAttempts: async (userID: string) =>
    CacheRepository.getForgotPasswordAttempts(userID),

  /**
   * Gets whether the user has asked OTP or not.
   *
   * @param userID - A user's ID
   * @returns A value, or null.
   */
  getHasAskedOTP: async (userID: string) =>
    CacheRepository.getHasAskedOTP(userID),

  /**
   * Gets the number of OTP attempts that is done by a user.
   *
   * @param userID - ID of the user.
   * @returns A value, or null.
   */
  getOTPAttempts: async (userID: string) =>
    CacheRepository.getOTPAttempts(userID),

  /**
   * Gets the OTP session of a user.
   *
   * @param jti - JSON Web Identifier, to be fetched as 'key'.
   * @returns Value of the OTP Session (usually the user identifier).
   */
  getOTPSession: async (jti: string) => CacheRepository.getOTPSession(jti),

  /**
   * Gets the lock used to send security alert emails.
   *
   * @param userID - ID of the user.
   * @returns Value to be used.
   */
  getSecurityAlertEmailLock: async (userID: string) =>
    CacheRepository.getSecurityAlertEmailLock(userID),

  /**
   * Gets all sessions from the cache, also strip cookie information.
   *
   * @returns All sessions in the cache.
   */
  getSessions: async () => {
    const sessions = await CacheRepository.getSessions();

    return sessions.map((s) => ({ ...s, cookie: undefined, ...s.sessionInfo }));
  },

  /**
   * Gets all sessions specific for a single user, also strip cookie information.
   *
   * @param userID - User ID.
   * @returns All sessions specific for a single user.
   */
  getUserSessions: async (userID: string) => {
    const sessions = await CacheRepository.getUserSessions(userID);

    return sessions.map((s) => ({ ...s, cookie: undefined, ...s.sessionInfo }));
  },

  /**
   * Pings the cache.
   *
   * @returns Asynchronous 'PONG' string.
   */
  ping: async () => CacheRepository.ping(),

  /**
   * Sets or increments the number of attempts of a password reset of a user. Default
   * TTL is set to 7200 seconds to 2 hours before one can ask to reset password again.
   *
   * @param userID - User ID.
   * @returns Asynchronous 'OK'.
   */
  setForgotPasswordAttempts: async (userID: string) =>
    CacheRepository.setForgotPasswordAttempts(userID),

  /**
   * Sets in the cache whether the user has asked for OTP or not.
   *
   * @param userID - ID of the user.
   * @returns Asychronous 'OK'.
   */
  setHasAskedOTP: async (userID: string) =>
    CacheRepository.setHasAskedOTP(userID),

  /**
   * Sets the number of OTP 'wrong' attempts of a single user.
   *
   * @param userID - ID of the user.
   * @returns Asynchronous 'OK'.
   */
  setOTPAttempts: async (userID: string) =>
    CacheRepository.setOTPAttempts(userID),

  /**
   * Sets the OTP session. Autheticates a user.
   *
   * @param jti - JSON Web Identifier, to be used as the 'key'.
   * @param value - Value of the 'key-value' pair.
   * @returns Asynchronous 'OK'.
   */
  setOTPSession: async (jti: string, value: string) =>
    CacheRepository.setOTPSession(jti, value),

  /**
   * Sets the user to be 'email-locked', that is do not send security alert to the user in repeat
   * to prevent SPAM.
   *
   * @param userID - ID of the user.
   * @returns Asynchronous 'OK'.
   */
  setSecurityAlertEmailLock: async (userID: string) =>
    CacheRepository.setSecurityAlertEmailLock(userID),
};

export default CacheService;
