import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { WriteMethodsAuthGuard } from '@app/auth/guards/write-methods-auth.guard';
import { ConfigurationModule } from '@config/configuration.module';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { AuthController } from './auth.controller';
import { AuthCompositionModule } from '@infra/composition/auth.composition.module';
import { UsersCompositionModule } from '@infra/composition/users.composition.module';
import { HashingInfrastructureModule } from '@infra/security/argon2/hashing.infrastructure.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigurationModule,
    HashingInfrastructureModule,
    // Composition: provee ApplicationAuthService y re-exporta JwtModule para estrategias
    UsersCompositionModule,
    AuthCompositionModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: WriteMethodsAuthGuard,
    },
  ],
  // Exportamos lo necesario para otros módulos; re-exportamos el composition module
  // para propagar JwtModule y el ApplicationAuthService
  exports: [PassportModule, JwtAuthGuard, AuthCompositionModule],
})
export class AuthModule {}
