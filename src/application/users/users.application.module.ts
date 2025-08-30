import { Module } from '@nestjs/common';

import { UsersCompositionModule } from '@infra/composition/users.composition.module';

@Module({
  imports: [UsersCompositionModule],
  exports: [UsersCompositionModule],
})
export class UsersApplicationModule {}
