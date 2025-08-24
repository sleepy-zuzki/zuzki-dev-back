import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from '../../config/configuration.service';

export type SupabaseJwtPayload = {
  sub: string;
  role?: string;
  email?: string;
  aud?: string;
  iss?: string;
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
    const expectedIss = process.env.SUPABASE_JWT_ISSUER;

    if (expectedAud && payload?.aud && payload.aud !== expectedAud) {
      throw new UnauthorizedException('Invalid token audience');
    }
    if (expectedIss && payload?.iss && payload.iss !== expectedIss) {
      throw new UnauthorizedException('Invalid token issuer');
    }
    return payload;
  }
}
