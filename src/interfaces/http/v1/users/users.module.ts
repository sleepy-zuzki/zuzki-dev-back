import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '@application/users/services/users.service';
import { USERS_REPOSITORY } from '@application/users/ports/users.tokens';
import { UsersInfrastructureModule } from '@infra/database/typeorm/adapters/users.infrastructure.module';
import { HashingInfrastructureModule } from '@infra/security/argon2/hashing.infrastructure.module';
import { UsersRepositoryPort } from '@application/users/ports/users-repository.port';
import { HASHING_SERVICE } from '@application/security/ports/security.tokens';
import { HashingPort } from '@application/security/ports/hashing.port';

@Module({
  imports: [UsersInfrastructureModule, HashingInfrastructureModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersService,
      useFactory: (repo: UsersRepositoryPort, hashing: HashingPort) =>
        new UsersService(repo, hashing),
      inject: [USERS_REPOSITORY, HASHING_SERVICE],
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
