import { Module } from '@nestjs/common';
import { AuthService as ApplicationAuthService } from '@application/auth/services/auth.service';
import {
  ACCESS_TOKEN_SERVICE,
  REFRESH_TOKEN_SERVICE,
} from '@application/auth/ports/auth.tokens';
import { AccessTokenPort } from '@application/auth/ports/access-token.port';
import { RefreshTokenPort } from '@application/auth/ports/refresh-token.port';
import { JwtAccessTokenInfrastructureModule } from '@infra/security/jwt/jwt-access-token.module';
import { RefreshTokenInfrastructureModule } from '@infra/database/typeorm/adapters/auth/refresh-token.infrastructure.module';

@Module({
  imports: [
    // Provee ACCESS_TOKEN_SERVICE y exporta JwtModule
    JwtAccessTokenInfrastructureModule,
    // Provee REFRESH_TOKEN_SERVICE (usa TypeORM + hashing + config internamente)
    RefreshTokenInfrastructureModule,
  ],
  providers: [
    {
      provide: ApplicationAuthService,
      useFactory: (
        access: AccessTokenPort,
        refresh: RefreshTokenPort,
      ): ApplicationAuthService => new ApplicationAuthService(access, refresh),
      inject: [ACCESS_TOKEN_SERVICE, REFRESH_TOKEN_SERVICE],
    },
  ],
  // Exportamos el service y también re-exportamos JwtModule a través del módulo de JWT
  exports: [ApplicationAuthService, JwtAccessTokenInfrastructureModule],
})
export class AuthCompositionModule {}
