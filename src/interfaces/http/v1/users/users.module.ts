import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersCompositionModule } from '@infra/composition/users.composition.module';

@Module({
  imports: [UsersCompositionModule],
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class UsersModule {}
