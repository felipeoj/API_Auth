import { UserEntity } from 'src/core/domain/entities/user.entity';

declare module 'express' {
  export interface Request {
    cookies: Record<string, string>;
    signedCookies?: Record<string, string>;
  }

  declare global {
    namespace Express {
      interface Request {
        cookies: Record<string, string>;
        user?: UserEntity;
      }
    }
  }

  export interface Response {
    cookie: (
      name: string,
      value: string,
      options?: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        maxAge?: number;
      },
    ) => void;

    clearCookie: (
      name: string,
      options?: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        maxAge?: number;
      },
    ) => void;
  }
}
