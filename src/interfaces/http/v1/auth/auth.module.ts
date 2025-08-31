import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { WriteMethodsAuthGuard } from '@app/auth/guards/write-methods-auth.guard';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { AuthApplicationModule } from '@application/auth/auth.application.module';
import { SecurityApplicationModule } from '@application/security/security.application.module';
import { UsersApplicationModule } from '@application/users/users.application.module';

import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthApplicationModule,
    SecurityApplicationModule,
    UsersApplicationModule,
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
  exports: [PassportModule, JwtAuthGuard, AuthApplicationModule],
})
export class AuthModule {}
