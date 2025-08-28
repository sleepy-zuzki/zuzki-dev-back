import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologyEntity } from '@infra/database/typeorm/entities/catalog/technology.entity';
import { TECHNOLOGIES_REPOSITORY } from '@application/catalog/ports/catalog.tokens';
import { TechnologiesRepositoryTypeormAdapter } from './technologies.repository.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([TechnologyEntity])],
  providers: [
    {
      provide: TECHNOLOGIES_REPOSITORY,
      useClass: TechnologiesRepositoryTypeormAdapter,
    },
  ],
  exports: [TECHNOLOGIES_REPOSITORY],
})
export class TechnologiesInfrastructureModule {}
