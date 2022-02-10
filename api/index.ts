import type { Server } from 'http';
import toobusy from 'toobusy-js';

import config from './config';
import bull from './infra/bull';
import loadExpress from './infra/express';
import prisma from './infra/prisma';
import redis from './infra/redis';
import CacheService from './modules/cache/service';
import Email from './modules/email';

/**
 * Gracefully shuts down the application server.
 *
 * @param server - Node.js server.
 * @param signal - Signal to be placed in standard output.
 * @param code - Exit error code.
 */
function shutdownServer(server: Server, signal: string, code: number) {
  const stoppingInfrastructures = [
    redis.quit(),
    prisma.$disconnect(),
    toobusy.shutdown(),
    bull.close(),
  ];

  // Shuts down the server, then synchronously stop the infrastructure.
  console.log(`Received ${signal}. Shutting down gracefully.`);
  server.close(() => {
    Promise.all(stoppingInfrastructures)
      .then(() => {
        console.log(`Server has closed due to ${signal} signal.`);
        process.exit(code);
      })
      .catch((err) => {
        console.error('Failed to shut down infrastructures due to an error.');
        console.error(err);
        process.exit(1);
      });
  });

  // If fail to shut down in time (30 secs), forcefully shutdown.
  setTimeout(() => {
    console.error('Graceful shutdown timeout, forcing exit.');
    process.exit(1);
  }, 30000);
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

  // Checks whether email service is ready to send messages.
  const transporter = new Email('', '').newTransport();
  transporter.verify((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Mailserver is ready to perform requests!');
    }
  });

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
