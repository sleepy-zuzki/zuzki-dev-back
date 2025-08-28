import { Module } from '@nestjs/common';
import { ProjectsService } from '@application/portfolio/services/projects.service';
import { FilesService } from '@application/portfolio/services/files.service';
import {
  PROJECTS_REPOSITORY,
  FILES_REPOSITORY,
} from '@application/portfolio/ports/portfolio.tokens';
import { ProjectsRepositoryPort } from '@application/portfolio/ports/projects-repository.port';
import { FilesRepositoryPort } from '@application/portfolio/ports/files-repository.port';
import { ProjectsInfrastructureModule } from '@infra/database/typeorm/adapters/portfolio/projects.infrastructure.module';
import { FilesInfrastructureModule } from '@infra/database/typeorm/adapters/portfolio/files.infrastructure.module';

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
