import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackEntity, TechnologyEntity } from '../../../core/database/entities';
import { StacksService } from './services/stacks.service';
import { StacksController } from './controllers/stacks.controller';
import { TechnologiesService } from './services/technologies.service';
import { TechnologiesController } from './controllers/technologies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StackEntity, TechnologyEntity])],
  controllers: [StacksController, TechnologiesController],
  providers: [StacksService, TechnologiesService],
  exports: [],
})
export class CatalogModule {}
