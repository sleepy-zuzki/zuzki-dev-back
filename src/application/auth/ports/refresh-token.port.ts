export interface RefreshTokenPort {
  generate(userId: string): Promise<{ refreshToken: string; expiresAt: Date }>;
  rotate(
    userId: string,
    currentToken: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }>;
  verify(userId: string, token: string): Promise<{ id: string } | null>;
  revoke(id: string): Promise<void>;
}
