import type { Request, Response } from 'express';

/**
 * Options object parameters.
 */
interface Params<T> {
  req: Request;
  res: Response;
  status: 'success' | 'fail' | 'error';
  statusCode: number;
  data: T;
  message: string;
  type: 'general' | 'users' | 'attendance' | 'auth' | 'sessions';
}

/**
 * Sends a response in the form that conforms to JSON API.
 *
 * @param param - Options object parameter for readability.
 * @returns Sends back a response (Express).
 */
const sendResponse = <T>({
  req,
  res,
  status,
  statusCode,
  data,
  message,
  type,
}: Params<T>) =>
  res.status(statusCode).json({
    status,
    message,
    data,
    type,
    meta: {
      copyright: `© ${new Date().getFullYear()} — Nicholas`,
      authors: ['Nicholas'],
    },
    jsonapi: {
      version: 'v1',
    },
    links: {
      self: `${req.protocol}://${req.hostname}${req.originalUrl}`,
    },
  });

export default sendResponse;
