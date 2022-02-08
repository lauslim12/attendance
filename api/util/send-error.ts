import type { Request, Response } from 'express';

import AppError from './app-error';

/**
 * Options object parameters.
 */
interface Params {
  req: Request;
  res: Response;
  error: AppError;
  stack?: string;
}

/**
 * Sends an error response that conforms to JSON API.
 *
 * @param param - Options object parameter for readability.
 * @returns Sends back a response (Express).
 */
const sendError = ({ req, res, error, stack = undefined }: Params) =>
  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    id: error.id,
    title: error.title,
    message: error.message,
    source: {
      pointer: `${req.protocol}://${req.hostname}${req.originalUrl}`,
    },

    // Optionally send this in development phase.
    stack,
  });

export default sendError;
