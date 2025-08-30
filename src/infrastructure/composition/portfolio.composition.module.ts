import { Module } from '@nestjs/common';

import { FilesRepositoryPort } from '@application/portfolio/ports/files-repository.port';
import {
  PROJECTS_REPOSITORY,
  FILES_REPOSITORY,
} from '@application/portfolio/ports/portfolio.tokens';
import { ProjectsRepositoryPort } from '@application/portfolio/ports/projects-repository.port';
import { FilesService } from '@application/portfolio/services/files.service';
import { ProjectsService } from '@application/portfolio/services/projects.service';
import { FilesInfrastructureModule } from '@infra/database/typeorm/adapters/portfolio/files.infrastructure.module';
import { ProjectsInfrastructureModule } from '@infra/database/typeorm/adapters/portfolio/projects.infrastructure.module';

@Module({
  imports: [ProjectsInfrastructureModule, FilesInfrastructureModule],
  providers: [
    {
      provide: ProjectsService,
      useFactory: (repo: ProjectsRepositoryPort) => new ProjectsService(repo),
      inject: [PROJECTS_REPOSITORY],
    },
    {
      provide: FilesService,
      useFactory: (repo: FilesRepositoryPort) => new FilesService(repo),
      inject: [FILES_REPOSITORY],
    },
  ],
  exports: [ProjectsService, FilesService],
})
export class PortfolioCompositionModule {}
