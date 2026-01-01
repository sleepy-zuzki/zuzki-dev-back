import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';

import { CatalogItemEntity } from '../entities/catalog-item.entity';
import { CatalogTypeEntity } from '../entities/catalog-type.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(CatalogTypeEntity)
    private readonly catalogTypeRepository: Repository<CatalogTypeEntity>,
    @InjectRepository(CatalogItemEntity)
    private readonly catalogItemRepository: Repository<CatalogItemEntity>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CatalogService.name);
  }

  async findAllCatalogs(): Promise<CatalogTypeEntity[]> {
    this.logger.debug('Finding all catalog types (catalogs)');
    return this.catalogTypeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findItemsByCatalogSlug(slug: string): Promise<CatalogItemEntity[]> {
    this.logger.debug({ slug }, 'Finding items for catalog slug');
    const type = await this.catalogTypeRepository.findOne({
      where: { slug },
    });

    if (!type) {
      this.logger.warn({ slug }, 'Catalog not found');
      throw new NotFoundException(`Catalog with slug "${slug}" not found`);
    }

    return this.catalogItemRepository.find({
      where: { typeId: type.id },
      order: { name: 'ASC' },
    });
  }
}
