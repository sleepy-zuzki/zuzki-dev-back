import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PROJECTS_REPOSITORY } from '@application/portfolio/ports/portfolio.tokens';
import { ProjectEntity } from '@infra/database/typeorm/entities/portfolio/project.entity';

import { ProjectsRepositoryTypeormAdapter } from './projects.repository.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  providers: [
    {
      provide: PROJECTS_REPOSITORY,
      useClass: ProjectsRepositoryTypeormAdapter,
    },
  ],
  exports: [PROJECTS_REPOSITORY],
})
export class ProjectsInfrastructureModule {}
