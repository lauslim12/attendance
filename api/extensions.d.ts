declare global {
  namespace NodeJS {
    interface ProcessEnv {
      COOKIE_SECRET?: string;
      DATABASE_URL: string;
      EMAIL_FROM?: string;
      EMAIL_HOST: string;
      EMAIL_USERNAME: string;
      EMAIL_PASSWORD: string;
      EMAIL_PORT?: number;
      JWT_AUDIENCE?: string;
      JWT_COOKIE_NAME?: string;
      JWT_ISSUER?: string;
      JWT_PRIVATE_KEY: string;
      JWT_PUBLIC_KEY: string;
      MAILTRAP_HOST: string;
      MAILTRAP_USERNAME: string;
      MAILTRAP_PASSWORD: string;
      NODE_ENV?: 'production' | 'development';
      PORT?: number;
      SESSION_COOKIE?: string;
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
    userRole?: string;
  }
}

export {};
