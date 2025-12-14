import { Injectable } from '@nestjs/common';
import { AccessTokenService } from './access-token.service';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accessTokens: AccessTokenService,
    private readonly refreshTokens: RefreshTokenService,
  ) { }

  signAccessToken(payload: {
    id: string;
    email: string;
    roles: string[];
  }): Promise<string> {
    return this.accessTokens.signAccessToken(payload);
  }

  generateRefreshToken(
    userId: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    return this.refreshTokens.generate(userId);
  }

  rotateRefreshToken(
    userId: string,
    currentToken: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    return this.refreshTokens.rotate(userId, currentToken);
  }

  verifyRefreshToken(
    userId: string,
    token: string,
  ): Promise<{ id: string } | null> {
    return this.refreshTokens.verify(userId, token);
  }

  revokeRefreshToken(id: string): Promise<void> {
    return this.refreshTokens.revoke(id);
  }
}
