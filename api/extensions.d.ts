declare module 'express-session' {
  interface SessionData {
    userID?: string;
    userRole?: string;
    lastActive?: string;
    sessionInfo?: {
      device?: string;
      ip?: string;
    };
    signedIn?: string;
  }
}

export {};
