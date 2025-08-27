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
import { ProjectsService } from '@application/portfolio/services/projects.service';
import { CreateProjectDto } from '@interfaces/http/v1/portfolio/dto/create-project.dto';
import { UpdateProjectDto } from '@interfaces/http/v1/portfolio/dto/update-project.dto';
import { ProjectResponseDto } from '@interfaces/http/v1/portfolio/dto/project.response.dto';
import { toProjectView } from '@application/portfolio/mappers/project.mappers';
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
  async list(): Promise<ProjectResponseDto[]> {
    const items = await this.projectsService.findAll();
    this.logger.debug({ count: items.length }, 'Listado de proyectos');
    return items.map(toProjectView);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<ProjectResponseDto> {
    this.logger.info({ slug }, 'Buscando proyecto por slug');
    const project = await this.projectsService.findBySlug(slug);
    if (!project) {
      this.logger.warn({ slug }, 'Proyecto no encontrado');
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.logger.debug({ id: project.id, slug }, 'Proyecto encontrado');
    return toProjectView(project);
  }

  @Post()
  async create(@Body() dto: CreateProjectDto): Promise<ProjectResponseDto> {
    this.logger.info({ slug: dto.slug, name: dto.name }, 'Creando proyecto');
    const created = await this.projectsService.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      repoUrl: dto.repoUrl ?? null,
      liveUrl: dto.liveUrl ?? null,
      category: dto.category ?? null,
      year: dto.year ?? null,
      isFeatured: dto.isFeatured ?? false,
      technologyIds: dto.technologyIds ?? null,
      previewImageId: dto.previewImageId ?? null,
    });
    this.logger.info({ id: created.id, slug: created.slug }, 'Proyecto creado');
    return toProjectView(created);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    this.logger.info({ id }, 'Actualizando proyecto');
    const updated = await this.projectsService.update(id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      repoUrl: dto.repoUrl,
      liveUrl: dto.liveUrl,
      category: dto.category,
      year: dto.year,
      isFeatured: dto.isFeatured,
      technologyIds: dto.technologyIds,
      previewImageId: dto.previewImageId,
    });
    if (!updated) {
      this.logger.warn({ id }, 'Proyecto no encontrado para actualizar');
      throw new NotFoundException('Proyecto no encontrado');
    }
    this.logger.info({ id: updated.id }, 'Proyecto actualizado');
    return toProjectView(updated);
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
