import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';

import { SupabaseStrategy } from '../../../../auth/strategies/supabase.strategy';
import { SupabaseAuthGuard } from '../../../../auth/guards/supabase-auth.guard';
import { WriteMethodsAuthGuard } from '../../../../auth/guards/write-methods-auth.guard';
import { ConfigurationModule } from '../../../../config/configuration.module';
import { ConfigurationService } from '../../../../config/configuration.service';
import { JwtStrategy } from '../../../../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { RefreshTokenEntity } from '../../../../infrastructure/database/typeorm/entities/auth/refresh-token.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { HashingInfrastructureModule } from '../../../../infrastructure/security/argon2/hashing.infrastructure.module';
import { AuthService as ApplicationAuthService } from '../../../../application/auth/services/auth.service';
import {
  ACCESS_TOKEN_SERVICE,
  REFRESH_TOKEN_SERVICE,
} from '../../../../application/auth/ports/auth.tokens';
import { JwtAccessTokenAdapter } from '../../../../infrastructure/security/jwt/jwt-access-token.adapter';
import { RefreshTokenTypeormAdapter } from '../../../../infrastructure/database/typeorm/adapters/refresh-token.repository.adapter';
import { HASHING_SERVICE } from '../../../../application/security/ports/security.tokens';
import { Repository } from 'typeorm';
import { HashingPort } from '../../../../application/security/ports/hashing.port';
import { AccessTokenPort } from '../../../../application/auth/ports/access-token.port';
import { RefreshTokenPort } from '../../../../application/auth/ports/refresh-token.port';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'supabase-jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        secret: config.getString('APP_JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
        },
      }),
    }),
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    ConfigurationModule,
    UsersModule,
    HashingInfrastructureModule,
  ],
  controllers: [AuthController],
  providers: [
    SupabaseStrategy,
    SupabaseAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: ACCESS_TOKEN_SERVICE,
      useFactory: (jwt: JwtService): AccessTokenPort =>
        new JwtAccessTokenAdapter(jwt),
      inject: [JwtService],
    },
    {
      provide: REFRESH_TOKEN_SERVICE,
      useFactory: (
        repo: Repository<RefreshTokenEntity>,
        hashing: HashingPort,
        config: ConfigurationService,
      ): RefreshTokenPort =>
        new RefreshTokenTypeormAdapter(repo, hashing, config),
      inject: [
        getRepositoryToken(RefreshTokenEntity),
        HASHING_SERVICE,
        ConfigurationService,
      ],
    },
    {
      provide: ApplicationAuthService,
      useFactory: (access: AccessTokenPort, refresh: RefreshTokenPort) =>
        new ApplicationAuthService(access, refresh),
      inject: [ACCESS_TOKEN_SERVICE, REFRESH_TOKEN_SERVICE],
    },
    {
      provide: APP_GUARD,
      useClass: WriteMethodsAuthGuard,
    },
  ],
  exports: [
    PassportModule,
    SupabaseAuthGuard,
    JwtModule,
    JwtAuthGuard,
    ApplicationAuthService,
  ],
})
export class AuthModule {}
