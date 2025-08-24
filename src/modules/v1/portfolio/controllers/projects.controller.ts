import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectEntity } from '../../../../core/database/entities';

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
}
