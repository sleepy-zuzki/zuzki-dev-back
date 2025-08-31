import { Module } from '@nestjs/common';

import { SecurityCompositionModule } from '@infra/composition/security.composition.module';

@Module({
  imports: [SecurityCompositionModule],
  exports: [SecurityCompositionModule],
})
export class SecurityApplicationModule {}
