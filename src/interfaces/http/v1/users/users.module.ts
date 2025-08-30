import { Module } from '@nestjs/common';

import { UsersApplicationModule } from '@application/users/users.application.module';

import { UsersController } from './users.controller';

@Module({
  imports: [UsersApplicationModule],
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class UsersModule {}
