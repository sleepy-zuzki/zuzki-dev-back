import { registerAs } from '@nestjs/config';

import type { AuthConfig } from '@shared/config/types';

export const AUTH_CONFIG = 'auth';

export enum HashDriver {
  Argon2 = 'argon2',
  Bcrypt = 'bcrypt',
}

export default registerAs(AUTH_CONFIG, (): AuthConfig => {
  const jwtSecret = process.env.APP_JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('Missing critical environment variable: APP_JWT_SECRET');
  }

  const jwtIssuer = process.env.APP_JWT_ISSUER;
  if (!jwtIssuer) {
    throw new Error('Missing critical environment variable: APP_JWT_ISSUER');
  }

  const jwtAudience = process.env.APP_JWT_AUDIENCE;
  if (!jwtAudience) {
    throw new Error('Missing critical environment variable: APP_JWT_AUDIENCE');
  }

  return {
    jwtSecret,
    jwtIssuer,
    jwtAudience,
    jwtTtl: parseInt(process.env.APP_JWT_TTL || '', 10) || 3600,
    accessTokenTtl: parseInt(process.env.ACCESS_TOKEN_TTL || '', 10) || 3600,
    refreshTokenTtl:
      parseInt(process.env.REFRESH_TOKEN_TTL || '', 10) || 2592000,
    hashDriver: (process.env.HASH_DRIVER as HashDriver) || HashDriver.Argon2,
    loginRateLimitWindow:
      parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW || '', 10) || 60,
    loginRateLimitMax:
      parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '', 10) || 10,
  };
});
