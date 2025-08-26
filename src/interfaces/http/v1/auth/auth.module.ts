import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupabaseStrategy } from '../../../../auth/strategies/supabase.strategy';
import { SupabaseAuthGuard } from '../../../../auth/guards/supabase-auth.guard';
import { WriteMethodsAuthGuard } from '../../../../auth/guards/write-methods-auth.guard';
import { PasswordService } from '../../../../auth/password.service';
import { ConfigurationModule } from '../../../../config/configuration.module';
import { ConfigurationService } from '../../../../config/configuration.service';
import { JwtStrategy } from '../../../../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { AuthService } from '../../../../auth/auth.service';
import { RefreshTokenEntity } from '../../../../infrastructure/database/typeorm/entities/auth/refresh-token.entity';
import { UsersModule } from '../../../../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // Passport para habilitar estrategias y AuthGuard
    PassportModule.register({ defaultStrategy: 'supabase-jwt' }),
    // JWT para firma/verificación de tokens propios
    JwtModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        secret: config.getString('APP_JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
        },
      }),
    }),
    // Repositorio de refresh tokens
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    // ConfigurationModule es global, pero lo importamos explícitamente para claridad
    ConfigurationModule,
    // Usuarios para validación en JwtStrategy
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    SupabaseStrategy,
    SupabaseAuthGuard,
    PasswordService,
    JwtStrategy,
    JwtAuthGuard,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: WriteMethodsAuthGuard,
    },
  ],
  exports: [
    PassportModule,
    SupabaseAuthGuard,
    PasswordService,
    JwtModule,
    JwtAuthGuard,
    AuthService,
  ],
})
export class AuthModule {}
