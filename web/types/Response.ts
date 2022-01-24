/**
 * JSONAPI standard response from the back-end.
 */
interface Response<T> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data: T;
  type: 'general' | 'users' | 'attendance' | 'auth' | 'sessions';
  meta: {
    copyright: string;
    authors: string[];
  };
  jsonapi: {
    version: string;
  };
  links: {
    self: string;
  };
}

export default Response;
