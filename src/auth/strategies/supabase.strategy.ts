import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from '../../config/configuration.service';

export type SupabaseJwtPayload = {
  sub: string;
  role?: string;
  email?: string;
  aud?: string;
  [key: string]: unknown;
};

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  Strategy,
  'supabase-jwt',
) {
  constructor(private readonly config: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getString('SUPABASE_JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  validate(payload: SupabaseJwtPayload) {
    const expectedAud = process.env.SUPABASE_JWT_AUDIENCE;
    if (expectedAud && payload?.aud && payload.aud !== expectedAud) {
      throw new UnauthorizedException('Invalid token audience');
    }
    // Puedes aplicar más validaciones según tus necesidades (iss, roles, etc.)
    return payload;
  }
}
