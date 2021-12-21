/**
 * Custom error class for operational errors.
 */
class AppError extends Error {
  public status: string;
  public statusCode: number;
  public isOperational: boolean;
  public type: string;

  constructor(message: string, statusCode: number) {
    super(message);

    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.type = 'operational.error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
