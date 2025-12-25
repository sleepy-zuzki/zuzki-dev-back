import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigurationModule } from '@config/configuration.module';
import { ConfigurationService } from '@config/configuration.service';
import { SharedSecurityModule } from '@shared/security/security.module';

import { UsersModule } from '../users/users.module';

import { AuthController } from './controllers/auth.controller';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { WriteMethodsAuthGuard } from './guards/write-methods-auth.guard';
import { AccessTokenService } from './services/access-token.service';
import { AuthConfigService } from './services/auth-config.service';
import { AuthService } from './services/auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigurationModule,
    UsersModule,
    SharedSecurityModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => ({
        secret: configService.getString('APP_JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getNumber('APP_JWT_TTL', 3600),
        },
      }),
      inject: [ConfigurationService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenService,
    RefreshTokenService,
    AuthConfigService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: WriteMethodsAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}
