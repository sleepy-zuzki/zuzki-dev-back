import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { FilesController } from './controllers/files.controller';
import { ProjectsService } from '@application/portfolio/services/projects.service';
import { FilesService } from '@application/portfolio/services/files.service';
import { PortfolioCompositionModule } from '@infra/composition/portfolio.composition.module';

@Module({
  imports: [PortfolioCompositionModule],
  controllers: [ProjectsController, FilesController],
  providers: [],
  exports: [ProjectsService, FilesService],
})
export class PortfolioModule {}
