import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { TechnologyResponseDto } from '../dto/technology.response.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';
import { toTechnologyView } from '../mappers/technology.mappers';
import { TechnologiesService } from '../services/technologies.service';

@Controller({ path: 'catalog/technologies', version: '1' })
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
    this.logger.debug({ count: items.length }, 'Listado de technologies');
    return items.map(toTechnologyView);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<TechnologyResponseDto> {
    this.logger.info({ slug }, 'Buscando technology por slug');
    const tech = await this.technologiesService.findBySlug(slug);
    if (!tech) {
      this.logger.warn({ slug }, 'Technology no encontrada');
      throw new NotFoundException('Technology no encontrada');
    }
    this.logger.debug({ id: tech.id, slug }, 'Technology encontrada');
    return toTechnologyView(tech);
  }

  @Post()
  async create(
    @Body() dto: CreateTechnologyDto,
  ): Promise<TechnologyResponseDto> {
    this.logger.info({ slug: dto.slug }, 'Creando technology');
    const created = await this.technologiesService.create({
      name: dto.name,
      slug: dto.slug,
      website: dto.website,
    });
    this.logger.info(
      { id: created.id, slug: created.slug },
      'Technology creada',
    );
    return toTechnologyView(created);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechnologyDto,
  ): Promise<TechnologyResponseDto> {
    this.logger.info({ id }, 'Actualizando technology');
    const updated = await this.technologiesService.update(id, {
      name: dto.name,
      slug: dto.slug,
    });
    if (!updated) {
      this.logger.warn({ id }, 'Technology no encontrada para actualizar');
      throw new NotFoundException('Technology no encontrada');
    }
    this.logger.info({ id: updated.id }, 'Technology actualizada');
    return toTechnologyView(updated);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: true }> {
    this.logger.info({ id }, 'Eliminando technology');
    const ok = await this.technologiesService.remove(id);
    if (!ok) {
      this.logger.warn({ id }, 'Technology no encontrada para eliminar');
      throw new NotFoundException('Technology no encontrada');
    }
    this.logger.info({ id }, 'Technology eliminada');
    return { success: true };
  }
}
