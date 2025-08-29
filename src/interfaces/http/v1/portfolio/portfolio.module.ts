import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { FilesController } from './controllers/files.controller';
import { PortfolioCompositionModule } from '@infra/composition/portfolio.composition.module';

@Module({
  imports: [PortfolioCompositionModule],
  controllers: [ProjectsController, FilesController],
  providers: [],
  exports: [],
})
export class PortfolioModule {}
