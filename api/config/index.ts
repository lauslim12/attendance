/**
 * All configuration values of this application from the environment variables.
 */
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
};

export default Object.freeze(config);
