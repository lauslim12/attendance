import type { SessionData } from 'express-session';

import redis from '../../infra/redis';

/**
 * Session type from Express.js, plus the session ID for easier
 * front-end processing.
 */
type Session = SessionData & { sid: string };

/**
 * Fetches all related data that matches to an expression in Redis. Usually
 * used in order to fetch all key-value pairs with the right pattern.
 *
 * @param key - Key in Redis to be iterated with 'SCAN'.
 * @returns All results of the 'SCAN' operation.
 */
const scanAll = async (key: string) => {
  const results: string[] = [];

  // Has to be mutated as to not raise the complexity.
  let cursor = 0;

  // Fetch initial data, then re-scan cursor (pagination style) and push results.
  do {
    const [c, v] = await redis.scan(cursor, ['MATCH', key]);
    cursor = Number.parseInt(c, 10);
    results.push(...v);
  } while (cursor !== 0);

  return results;
};

/**
 * Fetches all sessions that are available in the Redis cache.
 *
 * @returns All sessions in the Redis database.
 */
const allSessions = async () => {
  // Seek and fetch all active sessions.
  const activeSessions = await scanAll('sess:*');

  // Fetch all session data from available session IDs. The 'JSON.parse'
  // is required as Redis stores all data in its stringified form. Also
  // pass the session ID for easier deletion on the front-end. Perform parallel
  // processing with 'await Promise.all' to save time.
  const sessions: Session[] = await Promise.all(
    activeSessions.map(async (sess) => {
      const data = await redis.get(sess);
      const sid = sess.split(':')[1];

      if (data) {
        return { ...JSON.parse(data), sid };
      }
    })
  );

  return sessions;
};

/**
 * All cache operations in its low leveled form.
 */
const CacheRepository = {
  /**
   * Deletes a single session from the cache.
   *
   * @param sessionID - Session identifier.
   * @returns Asynchronous number, response returned from Redis.
   */
  deleteSession: async (sessionID: string) => redis.del(`sess:${sessionID}`),

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
   * Returns all sessions that is in this webservice.
   *
   * @returns All sessions in the webservice.
   */
  getSessions: async () => allSessions(),

  /**
   * Fetches all sessions that are specific to a single user.
   *
   * @param userID - User ID.
   * @returns All sessions specific to a single user.
   */
  getUserSessions: async (userID: string) =>
    (await allSessions()).filter((sess) => sess.userID === userID),

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
