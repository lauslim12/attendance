import type { WrappedNodeRedisClient } from 'handy-redis';
import type { Server } from 'http';

import config from './config';
import loadExpress from './infra/express';
import loadRedis from './infra/redis';

/**
 * Handles all signal events to the Node.js server.
 *
 * @param server - Express.js's server
 */
function handleSignals(server: Server, redis: WrappedNodeRedisClient) {
  // Handle interrupts.
  process.on('SIGINT', () => {
    console.log('Received SIGINT signal. Shutting down gracefully.');

    server.close(() => {
      redis.quit().then(() => process.exit(0));
    });
  });

  // Handle signal quits.
  process.on('SIGQUIT', () => {
    console.log('Received signal to quit. Shutting down gracefully.');

    server.close(async () => {
      redis.quit().then(() => process.exit(0));
    });
  });

  // Handle signal terminates.
  process.on('SIGTERM', () => {
    console.log('Received signal to terminate. Shutting down gracefully.');

    server.close(async () => {
      redis.quit().then(() => process.exit(0));
    });
  });
}

/**
 * Starts our server.
 */
async function startServer() {
  // Handle uncaught exceptions to prevent app error before starting.
  process.on('uncaughtException', (err: Error) => {
    console.log('Unhandled exception 💥! Application shutting down!');
    console.log(err.name, err.message);
    process.exit(1);
  });

  // Provision all infrastructures and prepare server.
  const redis = loadRedis();
  const app = loadExpress(redis);
  const server = app.listen(config.PORT, () => {
    console.log(`API has started and is running on port ${config.PORT}!`);
    console.log('API configurations / environment could be seen below:');
    console.log(config);
  });

  // Handle unhandled rejections, then shut down gracefully.
  process.on('unhandledRejection', (err: Error) => {
    console.log('Unhandled rejection 💥! Application shutting down!');
    console.log(err.name, err.message);

    // Finish all requests that are still pending, the shutdown gracefully.
    server.close(async () => {
      await redis.quit();
      process.exit(1);
    });
  });

  // Handle signals.
  handleSignals(server, redis);
}

/**
 * Starts our whole codebase.
 */
startServer().then(() => console.log('Express server has been loaded!'));
