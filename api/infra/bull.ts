import type { ConnectionOptions, Job } from 'bullmq';
import { Queue, Worker } from 'bullmq';

import config from '../config';

/**
 * Data type for our queue data.
 */
type BullData = {
  task: Promise<void>;
};

/**
 * Redis connection for the Bull Queue.
 */
const connection: ConnectionOptions = {
  host: config.REDIS_HOST,
  password: config.REDIS_PASSWORD,
  port: config.REDIS_PORT,
};

/**
 * Bull queue to process asynchronous, 'queueable' things such as
 * email and SMS. Retry job after failure.
 */
const bull = new Queue<BullData>('attendance-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

/**
 * Automatically called in every instance, no need to `await` as it implicitly
 * returns.
 */
const worker = new Worker(
  'attendance-queue',
  async (job: Job<BullData>) => job.data.task,
  {
    connection,
  }
);

/**
 * Setup pub/sub listeners.
 */
worker.on('completed', (job: Job<BullData>) =>
  console.log(`Job ${job.id} - ${job.name} has completed.`)
);
worker.on('failed', (job: Job<BullData>) =>
  console.log(
    `Job ${job.id} - ${job.name} has failed with reason: ${JSON.stringify(
      job.failedReason
    )}.`
  )
);

export default bull;
