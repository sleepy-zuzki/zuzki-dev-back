import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenService {
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
