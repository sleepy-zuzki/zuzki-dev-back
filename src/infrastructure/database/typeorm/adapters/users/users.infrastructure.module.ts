import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USERS_REPOSITORY } from '@application/users/ports/users.tokens';
import { UsersRepositoryTypeormAdapter } from './users.repository.adapter';
import { UserEntity } from '../../entities/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepositoryTypeormAdapter,
    },
  ],
  exports: [USERS_REPOSITORY],
})
export class UsersInfrastructureModule {}
