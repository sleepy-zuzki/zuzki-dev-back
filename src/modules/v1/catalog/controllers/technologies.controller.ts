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

  @Post()
  async create(@Body() dto: CreateTechnologyDto): Promise<TechnologyEntity> {
    return this.technologiesService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTechnologyDto,
  ): Promise<TechnologyEntity> {
    const updated = await this.technologiesService.update(id, dto);
    if (!updated) throw new NotFoundException('Technology no encontrada');
    return updated;
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ success: true }> {
    const ok = await this.technologiesService.remove(id);
    if (!ok) throw new NotFoundException('Technology no encontrada');
    return { success: true };
  }
}
