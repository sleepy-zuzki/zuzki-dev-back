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

@Controller({ path: 'portfolio/projects', version: '1' })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async list(): Promise<ProjectEntity[]> {
    return this.projectsService.findAll();
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<ProjectEntity> {
    const project = await this.projectsService.findBySlug(slug);
    if (!project) throw new NotFoundException('Proyecto no encontrado');
    return project;
  }

  @Post()
  async create(@Body() dto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    const updated = await this.projectsService.update(id, dto);
    if (!updated) throw new NotFoundException('Proyecto no encontrado');
    return updated;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: true }> {
    const ok = await this.projectsService.remove(id);
    if (!ok) throw new NotFoundException('Proyecto no encontrado');
    return { success: true };
  }
}
