import redis from '../../infra/redis';

/**
 * All cache operations in its low leveled form.
 */
const CacheRepository = {
  /**
   * Gets whether the user has asked OTP or not.
   *
   * @param userID - A user's ID
   * @returns A promise consisting of the value, or null.
   */
  getHasAskedOTP: async (userID: string) => redis.get(`asked-otp:${userID}`),

  /**
   * Gets the number of OTP attempts that is done by a user.
   *
   * @param userID - ID of the user.
   * @returns A promise consisting of the value, or null.
   */
  getOTPAttempts: async (userID: string) => redis.get(`otp-attempts:${userID}`),

  /**
   * Gets the OTP session related to a JTI.
   *
   * @param jti - JSON Web Identifier as 'key'.
   * @returns Value to be used elsewhere, usually 'user identifier'.
   */
  getOTPSession: async (jti: string) => redis.get(`otp-sess:${jti}`),

  /**
   * Pings the cache.
   *
   * @returns An asynchronous 'PONG' string.
   */
  ping: async () => redis.ping(),

  /**
   * Sets in the cache whether the user has asked for OTP or not.
   * TTL is 30 seconds. This will be used to prevent a user's spamming for OTP requests.
   *
   * @param userID - ID of the user.
   * @returns Asynchronous 'OK'.
   */
  setHasAskedOTP: async (userID: string) =>
    redis.setex(`asked-otp:${userID}`, 30, 'true'),

  /**
   * Sets the number of OTP 'wrong' attempts of a single user.
   * TTL is 86400 seconds or a single day. Will use Redis's 'INCR' method to ensure atomic operations.
   *
   * @param userID - ID of the user.
   * @returns Asynchronous 'OK'.
   */
  setOTPAttempts: async (userID: string) => {
    const currentAttempts = await redis.get(`otp-attempts:${userID}`);
    if (currentAttempts === null) {
      return redis.setex(`otp-attempts:${userID}`, 86400, '1');
    }

    return redis.incr(`otp-attempts:${userID}`);
  },

  /**
   * Sets the OTP session of a user. TTL is 900 seconds or 15 minutes.
   *
   * @param jti - JSON Web Identifier as 'key'.
   * @param value - Value to be stored, usually 'user identifier'.
   * @returns Asynchronous 'OK'.
   */
  setOTPSession: async (jti: string, value: string) =>
    redis.setex(`otp-sess:${jti}`, 900, value),
};

export default CacheRepository;
