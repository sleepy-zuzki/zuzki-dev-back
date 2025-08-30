import { Module } from '@nestjs/common';

import { AuthCompositionModule } from '@infra/composition/auth.composition.module';

import { AuthConfigService } from './services/auth-config.service';

@Module({
  imports: [AuthCompositionModule],
  providers: [AuthConfigService],
  exports: [AuthCompositionModule, AuthConfigService],
})
export class AuthApplicationModule {}
