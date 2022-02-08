import { getReasonPhrase } from 'http-status-codes';
import { nanoid } from 'nanoid';

/**
 * Custom error class for operational errors (JSON:API standards).
 */
class AppError extends Error {
  /**
   * Unique error identifier.
   */
  public id: string;

  /**
   * Response phrase (e.g. Internal Server Error).
   */
  public title: string;

  /**
   * Status of the request, should be either 'fail' or 'error'.
   */
  public status: 'fail' | 'error';

  /**
   * HTTP status code of the error.
   */
  public statusCode: number;

  /**
   * Marker of the error, if it is not an operational error, then
   * it is an Internal Server Error.
   */
  public isOperational: boolean;

  /**
   * Custom `type` of the error. Defaults to `operational.error`. Used
   * to maintain compatibility with `http-errors`.
   */
  public type: string;

  constructor(message: string, statusCode: number) {
    super(message);

    this.id = nanoid();
    this.title = getReasonPhrase(statusCode);
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.type = 'operational.error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
