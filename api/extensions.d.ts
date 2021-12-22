declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COOKIE_SECRET?: string;
      DATABASE_URL: string;
      JWT_AUDIENCE?: string;
      JWT_ISSUER?: string;
      JWT_PRIVATE_KEY: string;
      JWT_PUBLIC_KEY: string;
      NODE_ENV?: 'production' | 'development';
      PORT?: number;
      TOTP_ISSUER?: string;
    }
  }
}

declare module 'express' {
  interface Request {
    userID?: string;
  }
}

declare module 'express-session' {
  interface Session {
    userID?: string;
  }
}

export {};
