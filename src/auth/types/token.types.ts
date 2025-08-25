export type AccessTokenPayload = {
  sub: string; // user id
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string | string[];
};

export type RefreshTokenResult = {
  refreshToken: string;
  expiresAt: Date;
};
