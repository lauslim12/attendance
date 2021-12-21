import config from './config';
import loadExpress from './infra/express';
import loadRedis from './infra/redis';

/**
 * Starts our server.
 */
function startServer() {
  const redis = loadRedis();
  const app = loadExpress(redis);

  app.listen(config.PORT, () => {
    console.log(`API has started and is running on port ${config.PORT}!`);
    console.log('API configurations / environment could be seen below:');
    console.log(config);
  });
}

/**
 * Starts our whole codebase.
 */
startServer();
