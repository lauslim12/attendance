import type { Request, Response } from 'express';
import express from 'express';

/**
 * Handler to check the health of the service.
 */
const HealthHandler = () => {
  const router = express();

  /**
   * Checks the health of the service.
   */
  router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to the Attendance API!',
      type: 'general',
      data: [],
      meta: {
        copyright: `© ${new Date().getFullYear()} — Nicholas Dwiarto Wirasbawa`,
        authors: ['Nicholas Dwiarto Wirasbawa'],
      },
      jsonapi: {
        version: 'v1',
      },
      links: {
        self: `${req.protocol}://${req.hostname}${req.originalUrl}`,
        related: null,
      },
    });
  });

  return router;
};

export default HealthHandler;
