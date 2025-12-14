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

import { CreateShowcaseDto } from '../dto/create-showcase.dto';
import { ShowcaseResponseDto } from '../dto/showcase.response.dto';
import { UpdateShowcaseDto } from '../dto/update-showcase.dto';
import { toShowcaseView } from '../mappers/showcase.mappers';
import { ShowcasesService } from '../services/showcases.service';

@Controller({ path: 'projects/showcases', version: '1' })
export class ShowcasesController {
  constructor(
    private readonly showcasesService: ShowcasesService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ShowcasesController.name);
  }

  @Get()
  async list(): Promise<ShowcaseResponseDto[]> {
    const items = await this.showcasesService.findAll();
    this.logger.debug({ count: items.length }, 'Listing showcases');
    return items.map(toShowcaseView);
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string): Promise<ShowcaseResponseDto> {
    const item = await this.showcasesService.findBySlug(slug);
    if (!item) {
      this.logger.warn({ slug }, 'Showcase not found');
      throw new NotFoundException('Showcase not found');
    }
    return toShowcaseView(item);
  }

  @Post()
  async create(@Body() dto: CreateShowcaseDto): Promise<ShowcaseResponseDto> {
    this.logger.info({ slug: dto.slug }, 'Creating showcase');
    const created = await this.showcasesService.create(dto);
    return toShowcaseView(created);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateShowcaseDto,
  ): Promise<ShowcaseResponseDto> {
    this.logger.info({ id }, 'Updating showcase');
    const updated = await this.showcasesService.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Showcase not found');
    }
    return toShowcaseView(updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: true }> {
    this.logger.info({ id }, 'Deleting showcase');
    const ok = await this.showcasesService.remove(id);
    if (!ok) {
      throw new NotFoundException('Showcase not found');
    }
    return { success: true };
  }
}
