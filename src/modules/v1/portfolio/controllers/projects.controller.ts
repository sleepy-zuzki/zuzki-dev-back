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
import { ProjectsService } from '../services/projects.service';
import { ProjectEntity } from '../../../../core/database/entities';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { PinoLogger } from 'nestjs-pino';

@Controller({ path: 'portfolio/projects', version: '1' })
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ProjectsController.name);
  }

  @Get()
  async list(): Promise<ProjectEntity[]> {
    const items = await this.projectsService.findAll();
    this.logger.debug({ count: items.length }, 'Listado de proyectos');
    return items;
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<ProjectEntity> {
    this.logger.info({ slug }, 'Buscando proyecto por slug');
    const project = await this.projectsService.findBySlug(slug);
    if (!project) {
      this.logger.warn({ slug }, 'Proyecto no encontrado');
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.logger.debug({ id: project.id, slug }, 'Proyecto encontrado');
    return project;
  }

  @Post()
  async create(@Body() dto: CreateProjectDto): Promise<ProjectEntity> {
    this.logger.info({ slug: dto.slug, name: dto.name }, 'Creando proyecto');
    const created = await this.projectsService.create(dto);
    this.logger.info({ id: created.id, slug: created.slug }, 'Proyecto creado');
    return created;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    this.logger.info({ id }, 'Actualizando proyecto');
    const updated = await this.projectsService.update(id, dto);
    if (!updated) {
      this.logger.warn({ id }, 'Proyecto no encontrado para actualizar');
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.logger.info({ id: updated.id }, 'Proyecto actualizado');
    return updated;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: true }> {
    this.logger.info({ id }, 'Eliminando proyecto');
    const ok = await this.projectsService.remove(id);
    if (!ok) {
      this.logger.warn({ id }, 'Proyecto no encontrado para eliminar');
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.logger.info({ id }, 'Proyecto eliminado');
    return { success: true };
  }
}
