import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import { errors as jose } from 'jose';

import config from '../../config';
import AppError from '../../util/app-error';
import sendError from '../../util/send-error';

/**
 * Handles errors for expected errors. Transforms most error objects into a readable format
 * which is `AppError`.
 *
 * @param err - The 'true' error which was thrown.
 * @returns A new error object that conforms to 'AppError'.
 */
const handleOperationalErrors = (err: AppError): AppError => {
  // Handle body parser errors.
  if (err instanceof SyntaxError) {
    return new AppError('Invalid JSON! Please insert a valid one.', 400);
  }

  if (err.type === 'entity.too.large') {
    return new AppError('Request too large! Please reduce your payload!', 413);
  }

  // Handle Prisma errors.
  if (err instanceof PrismaClientKnownRequestError) {
    return new AppError(
      'Your request violates the constraints of the database. Please insert another data!',
      400
    );
  }

  // Handle validation errors.
  if (err instanceof ValidationError) {
    if (err.details.params) {
      return new AppError('Invalid route parameter(s) for this endpoint!', 400);
    }

    if (err.details.query) {
      return new AppError(`Field ${err.details.query[0].message}!`, 400);
    }

    if (err.details.body) {
      return new AppError(`Field ${err.details.body[0].message}!`, 400);
    }
  }

  // Handle JWT errors.
  if (err instanceof jose.JWTClaimValidationFailed) {
    return new AppError('Failed to verify the integrity of the token.', 401);
  }

  if (err instanceof jose.JWSInvalid) {
    return new AppError('Failed to verify the headers of the token.', 401);
  }

  if (err instanceof jose.JWSSignatureVerificationFailed) {
    return new AppError('Failed to verify the signature of the token.', 401);
  }

  if (err instanceof jose.JWTExpired) {
    return new AppError('MFA session expired. Please log in again!', 401);
  }

  // If anything is not caught, handle them here.
  return new AppError(err.message, err.statusCode);
};

/**
 * Custom error handling middleware for Express.js.
 *
 * @param err - Error object.
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 * @param next - Express.js's next function.
 */
const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // `AppError` is always an expected error.
  if (err instanceof AppError) {
    const error = handleOperationalErrors(err);

    if (config.NODE_ENV === 'development') {
      sendError({ req, res, error, stack: err.stack });
    } else {
      sendError({ req, res, error });
    }

    return;
  }

  // Otherwise, it is unexpected and should be handled properly in both environments by
  // transforming them into an instance of `AppError` and printing the stack trace properly.
  console.error(err);
  const error = new AppError(
    'An unknown error occured! Please try again later!',
    500
  );
  console.error(error);

  // Send stack in development, do not send stack in production.
  if (config.NODE_ENV === 'development') {
    sendError({ req, res, error, stack: error.stack });
  } else {
    sendError({ req, res, error });
  }

  // Go next.
  next();
};

export default errorHandler;
