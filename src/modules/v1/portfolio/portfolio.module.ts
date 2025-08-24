import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity, ProjectEntity } from '../../../core/database/entities';
import { ProjectsService } from './services/projects.service';
import { ProjectsController } from './controllers/projects.controller';
import { FilesService } from './services/files.service';
import { FilesController } from './controllers/files.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, FileEntity])],
  controllers: [ProjectsController, FilesController],
  providers: [ProjectsService, FilesService],
  exports: [],
})
export class PortfolioModule {}
