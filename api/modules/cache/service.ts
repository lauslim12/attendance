import CacheRepository from './repository';

/**
 * All services in Redis / cache are performed here.
 */
const CacheService = {
  /**
   * Sets the OTP session. Autheticates a user.
   *
   * @param jti - JSON Web Identifier, to be used as the 'key'.
   * @param value - Value of the 'key-value' pair.
   */
  setOTPSession: async (jti: string, value: string) =>
    CacheRepository.setOTPSession(jti, value),

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
};

export default CacheService;
