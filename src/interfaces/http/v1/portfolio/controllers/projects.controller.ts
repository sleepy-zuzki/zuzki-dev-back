import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { toProjectView } from '@application/portfolio/mappers/project.mappers';
import { ProjectsService } from '@application/portfolio/services/projects.service';

import { AddImageToCarouselDto } from '../dto/add-image-to-carousel.dto';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectResponseDto } from '../dto/project.response.dto';
import { ReorderCarouselDto } from '../dto/reorder-carousel.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

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

  @Get('featured')
  async listFeatured(): Promise<ProjectResponseDto[]> {
    const items = await this.projectsService.findFeatured();
    this.logger.debug(
      { count: items.length },
      'Listado de proyectos destacados',
    );
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

    if (!created) {
      return {
        carouselImages: [],
        category: undefined,
        description: undefined,
        id: 0,
        isFeatured: false,
        liveUrl: undefined,
        name: '',
        previewImage: undefined,
        repoUrl: undefined,
        slug: '',
        technologies: [],
        year: undefined,
      };
    }

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

  // --- Endpoints del Carrusel ---

  @Post(':id/images')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addImageToCarousel(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: AddImageToCarouselDto,
  ): Promise<void> {
    this.logger.info(
      { projectId, fileId: dto.fileId, position: dto.position },
      'Añadiendo imagen al carrusel',
    );
    await this.projectsService.addImageToCarousel(
      projectId,
      dto.fileId,
      dto.position,
    );
    this.logger.info(
      { projectId, fileId: dto.fileId },
      'Imagen añadida al carrusel',
    );
  }

  @Delete(':id/images/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeImageFromCarousel(
    @Param('id', ParseIntPipe) projectId: number,
    @Param('fileId', ParseIntPipe) fileId: number,
  ): Promise<void> {
    this.logger.info({ projectId, fileId }, 'Eliminando imagen del carrusel');
    await this.projectsService.removeImageFromCarousel(projectId, fileId);
    this.logger.info({ projectId, fileId }, 'Imagen eliminada del carrusel');
  }

  @Patch(':id/images')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reorderCarouselImages(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: ReorderCarouselDto,
  ): Promise<void> {
    this.logger.info({ projectId }, 'Reordenando imágenes del carrusel');
    await this.projectsService.updateCarouselImageOrder(projectId, dto.images);
    this.logger.info({ projectId }, 'Carrusel de imágenes reordenado');
  }
}
