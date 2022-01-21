import type Response from './Response';

/**
 * Session type from the back-end.
 */
export type Session = {
  cookie: {
    originalMaxAge: number;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    path: string;
    sameSite: 'strict' | 'lax' | 'none';
  };
  userID: string;
  userRole: 'admin' | 'user';
  lastActive: string;
  sessionInfo: {
    device: string;
    ip: string;
  };
  signedIn: string;
  sid: string;
};

export type SessionResponse = Response<Session>;
