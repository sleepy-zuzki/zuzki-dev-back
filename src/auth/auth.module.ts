import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { ConfigurationModule } from '../config/configuration.module';
import { APP_GUARD } from '@nestjs/core';
import { WriteMethodsAuthGuard } from './guards/write-methods-auth.guard';
import { PasswordService } from './password.service';

@Module({
  imports: [
    // Passport para habilitar estrategias y AuthGuard
    PassportModule.register({ defaultStrategy: 'supabase-jwt' }),
    // ConfigurationModule es global, pero lo importamos explícitamente para claridad
    ConfigurationModule,
  ],
  providers: [
    SupabaseStrategy,
    SupabaseAuthGuard,
    PasswordService,
    {
      provide: APP_GUARD,
      useClass: WriteMethodsAuthGuard,
    },
  ],
  exports: [PassportModule, SupabaseAuthGuard, PasswordService],
})
export class AuthModule {}
