import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { SupabaseStrategy } from '@app/auth/strategies/supabase.strategy';
import { SupabaseAuthGuard } from '@app/auth/guards/supabase-auth.guard';
import { WriteMethodsAuthGuard } from '@app/auth/guards/write-methods-auth.guard';
import { ConfigurationModule } from '@config/configuration.module';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService as ApplicationAuthService } from '@application/auth/services/auth.service';
import { AuthCompositionModule } from '@infra/composition/auth.composition.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'supabase-jwt' }),
    ConfigurationModule,
    UsersModule,
    // Composition: provee ApplicationAuthService y re-exporta JwtModule para estrategias
    AuthCompositionModule,
  ],
  controllers: [AuthController],
  providers: [
    SupabaseStrategy,
    SupabaseAuthGuard,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: WriteMethodsAuthGuard,
    },
  ],
  // Exportamos lo necesario para otros módulos; re-exportamos el composition module
  // para propagar JwtModule y el ApplicationAuthService
  exports: [
    PassportModule,
    SupabaseAuthGuard,
    JwtAuthGuard,
    ApplicationAuthService,
    AuthCompositionModule,
  ],
})
export class AuthModule {}
