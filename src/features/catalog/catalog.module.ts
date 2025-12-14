import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StacksController } from './controllers/stacks.controller';
import { TechnologiesController } from './controllers/technologies.controller';
import { StacksService } from './services/stacks.service';
import { TechnologiesService } from './services/technologies.service';
import { StackEntity } from './entities/stack.entity';
import { TechnologyEntity } from './entities/technology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StackEntity, TechnologyEntity])],
  controllers: [StacksController, TechnologiesController],
  providers: [StacksService, TechnologiesService],
  exports: [StacksService, TechnologiesService],
})
export class CatalogModule { }
