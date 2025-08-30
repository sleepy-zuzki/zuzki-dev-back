import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { WriteMethodsAuthGuard } from '@app/auth/guards/write-methods-auth.guard';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { AuthCompositionModule } from '@infra/composition/auth.composition.module';
import { UsersCompositionModule } from '@infra/composition/users.composition.module';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Application Modules: proveen servicios y re-exportan módulos necesarios
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
  // Exportamos lo necesario para otros módulos; re-exportamos el application module
  // para propagar JwtModule y el ApplicationAuthService
  exports: [PassportModule, JwtAuthGuard, AuthCompositionModule],
})
export class AuthModule {}
