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
import { TechnologiesService } from '../services/technologies.service';
import { TechnologyEntity } from '../../../../core/database/entities';
import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';
import { PinoLogger } from 'nestjs-pino';

@Controller({ path: 'catalog/technologies', version: '1' })
export class TechnologiesController {
  constructor(
    private readonly technologiesService: TechnologiesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(TechnologiesController.name);
  }

  @Get()
  async list(): Promise<TechnologyEntity[]> {
    const items = await this.technologiesService.findAll();
    this.logger.debug({ count: items.length }, 'Listado de technologies');
    return items;
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<TechnologyEntity> {
    this.logger.info({ slug }, 'Buscando technology por slug');
    const tech = await this.technologiesService.findBySlug(slug);
    if (!tech) {
      this.logger.warn({ slug }, 'Technology no encontrada');
      throw new NotFoundException('Technology no encontrada');
    }
    this.logger.debug({ id: tech.id, slug }, 'Technology encontrada');
    return tech;
  }

  @Post()
  async create(@Body() dto: CreateTechnologyDto): Promise<TechnologyEntity> {
    this.logger.info({ slug: dto.slug }, 'Creando technology');
    const created = await this.technologiesService.create(dto);
    this.logger.info(
      { id: created.id, slug: created.slug },
      'Technology creada',
    );
    return created;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechnologyDto,
  ): Promise<TechnologyEntity> {
    this.logger.info({ id }, 'Actualizando technology');
    const updated = await this.technologiesService.update(id, dto);
    if (!updated) {
      this.logger.warn({ id }, 'Technology no encontrada para actualizar');
      throw new NotFoundException('Technology no encontrada');
    }
    this.logger.info({ id: updated.id }, 'Technology actualizada');
    return updated;
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
