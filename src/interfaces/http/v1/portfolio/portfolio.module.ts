import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '@infra/database/typeorm/entities/portfolio/file.entity';
import { ProjectEntity } from '@infra/database/typeorm/entities/portfolio/project.entity';
import { TechnologyEntity } from '@infra/database/typeorm/entities/catalog/technology.entity';
import { ProjectsService } from '@interfaces/http/v1/portfolio/services/projects.service';
import { FilesService } from '@interfaces/http/v1/portfolio/services/files.service';
import { ProjectsController } from './controllers/projects.controller';
import { FilesController } from './controllers/files.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, TechnologyEntity, FileEntity]),
  ],
  controllers: [ProjectsController, FilesController],
  providers: [ProjectsService, FilesService],
  exports: [],
})
export class PortfolioModule {}
