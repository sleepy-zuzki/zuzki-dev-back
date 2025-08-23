import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategies/supabase.strategy';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  imports: [
    // Passport para habilitar estrategias y AuthGuard
    PassportModule.register({ defaultStrategy: 'supabase-jwt' }),
    // ConfigurationModule es global, pero lo importamos explícitamente para claridad
    ConfigurationModule,
  ],
  providers: [SupabaseStrategy, SupabaseAuthGuard],
  exports: [PassportModule, SupabaseAuthGuard],
})
export class AuthModule {}
