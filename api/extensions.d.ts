declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV?: 'production' | 'development';
      PORT?: number;
      TOTP_ISSUER?: string;
    }
  }
}

export {};
