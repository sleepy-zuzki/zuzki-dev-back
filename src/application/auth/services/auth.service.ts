import { AccessTokenPort } from '../ports/access-token.port';
import { RefreshTokenPort } from '../ports/refresh-token.port';

export class AuthService {
  constructor(
    private readonly accessTokens: AccessTokenPort,
    private readonly refreshTokens: RefreshTokenPort,
  ) {}

  signAccessToken(payload: {
    id: string;
    email: string;
    roles: string[];
  }): Promise<string> {
    return this.accessTokens.signAccessToken(payload);
  }

  generateRefreshToken(userId: string) {
    return this.refreshTokens.generate(userId);
  }

  rotateRefreshToken(userId: string, currentToken: string) {
    return this.refreshTokens.rotate(userId, currentToken);
  }

  verifyRefreshToken(userId: string, token: string) {
    return this.refreshTokens.verify(userId, token);
  }

  revokeRefreshToken(id: string) {
    return this.refreshTokens.revoke(id);
  }
}
