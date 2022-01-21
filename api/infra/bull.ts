import { ConnectionOptions, Job } from 'bullmq';
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
  port: Number.parseInt(config.REDIS_PORT, 10),
  password: config.REDIS_PASSWORD,
};

/**
 * Bull queue to process asynchronous, 'queueable' things such as
 * email and SMS.
 */
const bull = new Queue<BullData>('attendance-queue', { connection });

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
