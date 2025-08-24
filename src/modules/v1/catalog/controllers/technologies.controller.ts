import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { TechnologiesService } from '../services/technologies.service';
import { TechnologyEntity } from '../../../../core/database/entities';

@Controller({ path: 'catalog/technologies', version: '1' })
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Get()
  async list(): Promise<TechnologyEntity[]> {
    return this.technologiesService.findAll();
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<TechnologyEntity> {
    const tech = await this.technologiesService.findBySlug(slug);
    if (!tech) throw new NotFoundException('Technology no encontrada');
    return tech;
  }
}
