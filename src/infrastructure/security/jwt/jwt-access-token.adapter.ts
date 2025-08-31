import type { AccessTokenPort } from '@application/auth/ports/access-token.port';

import type { JwtService } from '@nestjs/jwt';

export class JwtAccessTokenAdapter implements AccessTokenPort {
  constructor(private readonly jwt: JwtService) {}

  signAccessToken(payload: {
    id: string;
    email: string;
    roles: string[];
  }): Promise<string> {
    // Mapear "id" a "sub" (subject) que es el estándar JWT
    return this.jwt.signAsync({
      sub: payload.id,
      email: payload.email,
      roles: payload.roles,
    });
  }
}
