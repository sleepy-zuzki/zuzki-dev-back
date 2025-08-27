import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../../../../application/users/services/users.service';
import { USERS_REPOSITORY } from '../../../../application/users/ports/users.tokens';
import { UsersInfrastructureModule } from '../../../../infrastructure/database/typeorm/adapters/users.infrastructure.module';
import { HashingInfrastructureModule } from '../../../../infrastructure/security/argon2/hashing.infrastructure.module';

@Module({
  imports: [UsersInfrastructureModule, HashingInfrastructureModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useFactory: (repo: any) => new UsersService(repo),
      inject: [USERS_REPOSITORY],
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
