import { Module } from '@nestjs/common';

import { PortfolioApplicationModule } from '@application/portfolio/portfolio.application.module';

import { FilesController } from './controllers/files.controller';
import { ProjectsController } from './controllers/projects.controller';

@Module({
  imports: [PortfolioApplicationModule],
  controllers: [ProjectsController, FilesController],
  providers: [],
  exports: [],
})
export class PortfolioModule {}
