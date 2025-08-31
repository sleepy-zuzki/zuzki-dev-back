import { Module } from '@nestjs/common';

import { HashingInfrastructureModule } from '@infra/security/argon2/hashing.infrastructure.module';

@Module({
  imports: [HashingInfrastructureModule],
  exports: [HashingInfrastructureModule],
})
export class SecurityCompositionModule {}
