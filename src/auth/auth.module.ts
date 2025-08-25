import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { ConfigurationModule } from '../config/configuration.module';
import { APP_GUARD } from '@nestjs/core';
import { WriteMethodsAuthGuard } from './guards/write-methods-auth.guard';
import { PasswordService } from './password.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationService } from '../config/configuration.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '../core/database/entities';
import { UsersModule } from '../users/users.module';
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
