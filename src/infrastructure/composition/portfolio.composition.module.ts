import { Module } from '@nestjs/common';

import {
  FileStoragePort,
  FILE_STORAGE_PORT,
} from '@application/portfolio/ports/file-storage.port';
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
import { StorageInfrastructureModule } from '@infra/storage/storage.module';

@Module({
  imports: [
    ProjectsInfrastructureModule,
    FilesInfrastructureModule,
    StorageInfrastructureModule,
  ],
  providers: [
    {
      provide: ProjectsService,
      useFactory: (
        projectsRepo: ProjectsRepositoryPort,
        filesRepo: FilesRepositoryPort,
        storage: FileStoragePort,
      ) => new ProjectsService(projectsRepo, filesRepo, storage),
      inject: [PROJECTS_REPOSITORY, FILES_REPOSITORY, FILE_STORAGE_PORT],
    },
    {
      provide: FilesService,
      useFactory: (repo: FilesRepositoryPort, storage: FileStoragePort) =>
        new FilesService(repo, storage),
      inject: [FILES_REPOSITORY, FILE_STORAGE_PORT],
    },
  ],
  exports: [ProjectsService, FilesService],
})
export class PortfolioCompositionModule {}
