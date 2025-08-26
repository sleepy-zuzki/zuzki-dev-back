import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StackEntity } from '@infra/database/typeorm/entities/catalog/stack.entity';
import { TechnologyEntity } from '@infra/database/typeorm/entities/catalog/technology.entity';
import { StacksService } from '@interfaces/http/v1/catalog/services/stacks.service';
import { TechnologiesService } from '@interfaces/http/v1/catalog/services/technologies.service';
import { StacksController } from './controllers/stacks.controller';
import { TechnologiesController } from './controllers/technologies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StackEntity, TechnologyEntity])],
  controllers: [StacksController, TechnologiesController],
  providers: [StacksService, TechnologiesService],
  exports: [],
})
export class CatalogModule {}
