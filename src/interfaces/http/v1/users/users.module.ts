import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '@application/users/services/users.service';
import { UsersCompositionModule } from '@infra/composition/users.composition.module';

@Module({
  imports: [UsersCompositionModule],
  controllers: [UsersController],
  providers: [],
  exports: [UsersService],
})
export class UsersModule {}
