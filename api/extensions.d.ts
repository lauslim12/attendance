declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NODE_ENV?: 'production' | 'development';
      PORT?: number;
    }
  }
}

export {};
