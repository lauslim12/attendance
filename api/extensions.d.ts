declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COOKIE_SECRET?: string;
      DATABASE_URL: string;
      NODE_ENV?: 'production' | 'development';
      PORT?: number;
      TOTP_ISSUER?: string;
    }
  }
}

declare module 'express-session' {
  interface Session {
    userID?: string;
  }
}

export {};
