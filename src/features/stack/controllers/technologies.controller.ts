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

import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { TechnologyResponseDto } from '../dto/technology.response.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';
import { toTechnologyView } from '../mappers/technology.mappers';
import { TechnologiesService } from '../services/technologies.service';

@Controller({ path: 'stack/technologies', version: '1' })
export class TechnologiesController {
  constructor(
    private readonly technologiesService: TechnologiesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TechnologiesController.name);
  }

  @Get()
  async list(): Promise<TechnologyResponseDto[]> {
    const items = await this.technologiesService.findAll();
    this.logger.debug({ count: items.length }, 'Listing technologies');
    return items.map(toTechnologyView);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<TechnologyResponseDto> {
    const tech = await this.technologiesService.findBySlug(slug);
    if (!tech) {
      this.logger.warn({ slug }, 'Technology not found');
      throw new NotFoundException('Technology not found');
    }
    return toTechnologyView(tech);
  }

  @Post()
  async create(
    @Body() dto: CreateTechnologyDto,
  ): Promise<TechnologyResponseDto> {
    this.logger.info({ slug: dto.slug }, 'Creating technology');
    const created = await this.technologiesService.create(dto);
    return toTechnologyView(created);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTechnologyDto,
  ): Promise<TechnologyResponseDto> {
    this.logger.info({ id }, 'Updating technology');
    const updated = await this.technologiesService.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Technology not found');
    }
    return toTechnologyView(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: true }> {
    this.logger.info({ id }, 'Deleting technology');
    const ok = await this.technologiesService.remove(id);
    if (!ok) {
      throw new NotFoundException('Technology not found');
    }
    return { success: true };
  }
}
