import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { STACKS_REPOSITORY } from '@application/catalog/ports/catalog.tokens';
import { StackEntity } from '@infra/database/typeorm/entities/catalog/stack.entity';

import { StacksRepositoryTypeormAdapter } from './stacks.repository.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([StackEntity])],
  providers: [
    {
      provide: STACKS_REPOSITORY,
      useClass: StacksRepositoryTypeormAdapter,
    },
  ],
  exports: [STACKS_REPOSITORY],
})
export class StacksInfrastructureModule {}
