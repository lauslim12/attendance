import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';

import config from '../../config';
import AppError from '../../util/app-error';

/**
 * Send error in the development phase. Will transform a request to conform to 'AppError'.
 *
 * @param err - Express.js's or custom error object.
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 */
const sendErrorDevelopment = (err: AppError, _: Request, res: Response) => {
  const appError = {
    ...err,
    statusCode: err.statusCode || 500,
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
  };

  res.status(appError.statusCode).json({
    status: appError.status,
    error: appError,
    message: appError.message,
    stack: appError.stack,
  });
};

/**
 * Send error in the production phase.
 *
 * @param err - Express.js's or custom error object.
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 */
const sendErrorProduction = (err: AppError, _: Request, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    return;
  }

  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'An unknown error occured! Please try again later!',
  });
};

/**
 * Handles errors for production scenarios. Transforms most error objects into a readable format.
 *
 * @param err - The 'true' error which was thrown.
 * @returns A new error object that conforms to 'AppError'.
 */
const handleProductionErrors = (err: AppError): AppError => {
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

    if (err.details.body) {
      return new AppError(`Field ${err.details.body[0].message}!`, 400);
    }
  }

  // Handle JWT errors.
  if (err.name === 'JWTClaimValidationFailed') {
    return new AppError('Failed to verify the integrity of the token.', 401);
  }

  if (err.name === 'JWSInvalid') {
    return new AppError('Failed to verify the headers of the token.', 401);
  }

  if (err.name === 'JWSSignatureVerificationFailed') {
    return new AppError('Failed to verify the signature of the token.', 401);
  }

  if (err.name === 'JWTExpired') {
    return new AppError('MFA session expired. Please log in again!', 401);
  }

  // Returns the AppError object.
  return {
    ...err,
    statusCode: err.statusCode || 500,
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
  };
};

/**
 * Custom error handling middleware for Express.js.
 *
 * @param err - Express.js's or custom error object.
 * @param req - Express.js's request object.
 * @param res - Express.js's response object.
 * @param next - Express.js's next function.
 */
const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.NODE_ENV === 'development') {
    sendErrorDevelopment(error, req, res);
  }

  if (
    config.NODE_ENV === 'production' ||
    config.NODE_ENV === 'mock-production'
  ) {
    sendErrorProduction(handleProductionErrors(error), req, res);
  }

  next();
};

export default errorHandler;
