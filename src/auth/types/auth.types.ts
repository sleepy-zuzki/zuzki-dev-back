export type AuthUserInfo = {
  id: string;
  email: string;
  roles: string[];
};

export type AuthTokens = {
  accessToken: string;
  expiresIn: number; // segundos
  refreshToken: string;
  refreshExpiresAt: string; // ISO
};

export type LoginResponse = AuthTokens & {
  user: AuthUserInfo;
};
