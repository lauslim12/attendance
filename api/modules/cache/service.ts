import CacheRepository from './repository';

/**
 * All services in Redis / cache are performed here.
 */
const CacheService = {
  /**
   * Gets whether the user has asked OTP or not.
   *
   * @param userID - A user's ID
   */
  getHasAskedOTP: async (userID: string) =>
    CacheRepository.getHasAskedOTP(userID),

  /**
   * Gets the number of OTP attempts that is done by a user.
   *
   * @param userID - ID of the user.
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
   * Pings the cache.
   *
   * @returns Asynchronous 'PONG' string.
   */
  ping: async () => CacheRepository.ping(),

  /**
   * Sets in the cache whether the user has asked for OTP or not.
   *
   * @param userID - ID of the user.
   */
  setHasAskedOTP: async (userID: string) =>
    CacheRepository.setHasAskedOTP(userID),

  /**
   * Sets the number of OTP 'wrong' attempts of a single user.
   *
   * @param userID - ID of the user.
   */
  setOTPAttempts: async (userID: string) =>
    CacheRepository.setOTPAttempts(userID),

  /**
   * Sets the OTP session. Autheticates a user.
   *
   * @param jti - JSON Web Identifier, to be used as the 'key'.
   * @param value - Value of the 'key-value' pair.
   */
  setOTPSession: async (jti: string, value: string) =>
    CacheRepository.setOTPSession(jti, value),
};

export default CacheService;
