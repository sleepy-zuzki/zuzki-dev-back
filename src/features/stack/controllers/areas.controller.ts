import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { AreaResponseDto } from '../dto/area.response.dto';
import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';
import { toAreaView } from '../mappers/area.mappers';
import { AreasService } from '../services/areas.service';

@Controller({ path: 'stack/areas', version: '1' })
export class AreasController {
  constructor(
    private readonly areasService: AreasService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AreasController.name);
  }

  @Get()
  async list(): Promise<AreaResponseDto[]> {
    const items = await this.areasService.findAll();
    this.logger.debug({ count: items.length }, 'Listing areas');
    return items.map(toAreaView);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<AreaResponseDto> {
    const area = await this.areasService.findBySlug(slug);
    if (!area) {
      this.logger.warn({ slug }, 'Area not found');
      throw new NotFoundException('Area not found');
    }
    return toAreaView(area);
  }

  @Post()
  async create(@Body() dto: CreateAreaDto): Promise<AreaResponseDto> {
    this.logger.info({ slug: dto.slug }, 'Creating area');
    const created = await this.areasService.create(dto);
    return toAreaView(created);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAreaDto,
  ): Promise<AreaResponseDto> {
    this.logger.info({ id }, 'Updating area');
    const updated = await this.areasService.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Area not found');
    }
    return toAreaView(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: true }> {
    this.logger.info({ id }, 'Deleting area');
    const ok = await this.areasService.remove(id);
    if (!ok) {
      throw new NotFoundException('Area not found');
    }
    return { success: true };
  }
}
