import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FILES_REPOSITORY } from '@application/portfolio/ports/portfolio.tokens';
import { FileEntity } from '@infra/database/typeorm/entities/portfolio/file.entity';

import { FilesRepositoryTypeormAdapter } from './files.repository.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  providers: [
    {
      provide: FILES_REPOSITORY,
      useClass: FilesRepositoryTypeormAdapter,
    },
  ],
  exports: [FILES_REPOSITORY],
})
export class FilesInfrastructureModule {}
