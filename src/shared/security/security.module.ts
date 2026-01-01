import { Module } from '@nestjs/common';

import { Argon2HashingAdapter } from './argon2-hashing.adapter';

@Module({
  providers: [Argon2HashingAdapter],
  exports: [Argon2HashingAdapter],
})
export class SharedSecurityModule {}
