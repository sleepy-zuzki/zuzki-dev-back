import { Controller, Get, Param } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { CatalogItemResponseDto } from '../dto/catalog-item.response.dto';
import { CatalogResponseDto } from '../dto/catalog.response.dto';
import { CatalogService } from '../services/catalog.service';

@Controller({
  path: 'catalogs',
  version: '1',
})
export class CatalogController {
  constructor(
    private readonly catalogService: CatalogService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CatalogController.name);
  }

  @Get()
  async findAll(): Promise<CatalogResponseDto[]> {
    this.logger.debug('Listing all catalogs');
    const catalogs = await this.catalogService.findAllCatalogs();
    return catalogs.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));
  }

  @Get(':slug/items')
  async findItems(
    @Param('slug') slug: string,
  ): Promise<CatalogItemResponseDto[]> {
    this.logger.debug({ slug }, 'Listing items for catalog');
    const items = await this.catalogService.findItemsByCatalogSlug(slug);
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
    }));
  }
}
