import config from './config';
import loadExpress from './infra/express';

/**
 * Starts our server.
 */
function startServer() {
  const app = loadExpress();

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
