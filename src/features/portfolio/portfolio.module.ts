import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedStorageModule } from '@shared/storage/storage.module';

import { FilesController } from './controllers/files.controller';
import { ProjectsController } from './controllers/projects.controller';
import { FileEntity } from './entities/file.entity';
import { ProjectEntity } from './entities/project.entity';
import { FilesService } from './services/files.service';
import { ProjectsService } from './services/projects.service';

// Storage Provider configuration
// We can use a factory or class provider depending on config.
// For now, I'll direct bind the interface to the implementation for simplicity,
// assuming ConfigService is available globally or injected.

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, FileEntity]),
    SharedStorageModule,
  ],
  controllers: [ProjectsController, FilesController],
  providers: [
    ProjectsService,
    FilesService,
    // Adapter is provided by SharedStorageModule
  ],
  exports: [ProjectsService, FilesService],
})
export class PortfolioModule {}
