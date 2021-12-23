import redis from '../../infra/redis';

/**
 * All cache operations in its low leveled form.
 */
const CacheRepository = {
  /**
   * Sets the OTP session of a user.
   *
   * @param jti - JSON Web Identifier as 'key'.
   * @param value - Value to be stored, usually 'user identifier'.
   */
  setOTPSession: async (jti: string, value: string) =>
    redis.setex(`otp-sess:${jti}`, 900, value),

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
};

export default CacheRepository;
