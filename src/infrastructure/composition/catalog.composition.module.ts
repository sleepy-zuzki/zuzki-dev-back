import { Module } from '@nestjs/common';
import { StacksService } from '@application/catalog/services/stacks.service';
import { TechnologiesService } from '@application/catalog/services/technologies.service';
import {
  STACKS_REPOSITORY,
  TECHNOLOGIES_REPOSITORY,
} from '@application/catalog/ports/catalog.tokens';
import { StackRepositoryPort } from '@application/catalog/ports/stack-repository.port';
import { TechnologyRepositoryPort } from '@application/catalog/ports/technology-repository.port';
import { StacksInfrastructureModule } from '@infra/database/typeorm/adapters/stacks.infrastructure.module';
import { TechnologiesInfrastructureModule } from '@infra/database/typeorm/adapters/technologies.infrastructure.module';

@Module({
  imports: [StacksInfrastructureModule, TechnologiesInfrastructureModule],
  providers: [
    {
      provide: StacksService,
      useFactory: (repo: StackRepositoryPort) => new StacksService(repo),
      inject: [STACKS_REPOSITORY],
    },
    {
      provide: TechnologiesService,
      useFactory: (repo: TechnologyRepositoryPort) =>
        new TechnologiesService(repo),
      inject: [TECHNOLOGIES_REPOSITORY],
    },
  ],
  exports: [StacksService, TechnologiesService],
})
export class CatalogCompositionModule {}
