import { Module } from '@nestjs/common';
import { HASHING_SERVICE } from '../../../application/security/ports/security.tokens';
import { Argon2HashingAdapter } from './argon2-hashing.adapter';

@Module({
  providers: [
    {
      provide: HASHING_SERVICE,
      useClass: Argon2HashingAdapter,
    },
  ],
  exports: [HASHING_SERVICE],
})
export class HashingInfrastructureModule {}
