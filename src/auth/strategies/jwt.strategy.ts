import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from '@config/configuration.service';
import { AccessTokenPayload } from '../types/token.types';
import { UsersService } from '@application/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigurationService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getString('APP_JWT_SECRET'),
      issuer: process.env.APP_JWT_ISSUER || undefined,
      audience: process.env.APP_JWT_AUDIENCE || undefined,
      algorithms: ['HS256'],
    });
  }

  async validate(payload: AccessTokenPayload) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token sin subject');
    }
    const user = await this.users.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }
    // Adjuntamos un objeto de usuario mínimo al request
    return { id: user.id, email: user.email, roles: user.roles };
  }
}
