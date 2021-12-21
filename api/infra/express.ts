import type { Request, Response } from 'express';
import express from 'express';

/**
 * Loads an Express application.
 */
function loadExpress() {
  const app = express();

  app.get('/api/v1', (_: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome to Attendance API!',
    });
  });

  return app;
}

export default loadExpress;
