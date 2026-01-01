import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AreasController } from './controllers/areas.controller';
import { TechnologiesController } from './controllers/technologies.controller';
import { StackAreaEntity } from './entities/area.entity';
import { StackTechnologyEntity } from './entities/technology.entity';
import { AreasService } from './services/areas.service';
import { TechnologiesService } from './services/technologies.service';

@Module({
  imports: [TypeOrmModule.forFeature([StackAreaEntity, StackTechnologyEntity])],
  controllers: [AreasController, TechnologiesController],
  providers: [AreasService, TechnologiesService],
  exports: [TypeOrmModule, AreasService, TechnologiesService],
})
export class StackModule {}
