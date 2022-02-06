import type { Server } from 'http';

import config from './config';
import bull from './infra/bull';
import loadExpress from './infra/express';
import prisma from './infra/prisma';
import redis from './infra/redis';
import CacheService from './modules/cache/service';

/**
 * Gracefully shuts down the application server.
 *
 * @param server - Node.js server.
 * @param signal - Signal to be placed in standard output.
 * @param code - Exit error code.
 */
function shutdownServer(server: Server, signal: string, code: number) {
  console.log(`Received ${signal}. Shutting down gracefully.`);

  server.close(() => {
    Promise.all([redis.quit(), prisma.$disconnect()]).finally(() => {
      console.log(`Server has closed due to ${signal} signal.`);
      process.exit(code);
    });
  });
}

/**
 * Starts our server.
 */
async function startServer() {
  // Handle uncaught exceptions to prevent app error before starting.
  process.on('uncaughtException', (err: Error) => {
    console.error('Unhandled exception 💥! Application shutting down!');
    console.error(err.name, err.message);
    process.exit(1);
  });

  // Provision all infrastructures and test connectivity.
  const status = await Promise.all([
    CacheService.ping(),
    prisma.$queryRaw`SELECT 1`,
    bull.getMaxListeners(),
  ]);
  console.log(`Status of infrastructures: ${JSON.stringify(status)}.`);

  // Prepare server.
  const app = loadExpress();
  const server = app.listen(config.PORT, () => {
    console.log(`API ready on port ${config.PORT} on mode ${config.NODE_ENV}!`);
  });

  // Handle unhandled rejections, then shut down gracefully.
  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled rejection 💥! Application shutting down!');
    console.error(err.name, err.message);

    // Finish all requests that are still pending, the shutdown gracefully.
    shutdownServer(server, 'unhandledRejection', 1);
  });

  // Handle signals: interrupts, quits, and terminates.
  process.on('SIGINT', () => shutdownServer(server, 'SIGINT', 0));
  process.on('SIGQUIT', () => shutdownServer(server, 'SIGQUIT', 0));
  process.on('SIGTERM', () => shutdownServer(server, 'SIGTERM', 0));
}

/**
 * Starts our whole codebase.
 */
void startServer();
