import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import {
  AttachFileDto,
  ReorderFilesDto,
  UpdateFileContextDto,
} from '@shared/dto/manage-files.dto';

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

  @Get('featured')
  async getFeatured(): Promise<ShowcaseResponseDto[]> {
    const items = await this.showcasesService.findFeatured();
    this.logger.debug({ count: items.length }, 'Listing featured showcases');
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

  // --- FILE MANAGEMENT ENDPOINTS ---

  @Post(':id/files')
  @HttpCode(HttpStatus.NO_CONTENT)
  async attachFile(
    @Param('id') id: string,
    @Body() dto: AttachFileDto,
  ): Promise<void> {
    this.logger.info({ id, fileId: dto.fileId }, 'Attaching file to showcase');
    await this.showcasesService.attachFile(id, dto);
  }

  @Delete(':id/files/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async detachFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    this.logger.info({ id, fileId }, 'Detaching file from showcase');
    await this.showcasesService.detachFile(id, fileId);
  }

  @Patch(':id/files/order')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reorderFiles(
    @Param('id') id: string,
    @Body() dto: ReorderFilesDto,
  ): Promise<void> {
    this.logger.info({ id }, 'Reordering files in showcase');
    await this.showcasesService.reorderFiles(id, dto);
  }

  @Put(':id/files/:fileId/context')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateFileContext(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
    @Body() dto: UpdateFileContextDto,
  ): Promise<void> {
    this.logger.info(
      { id, fileId, context: dto.contextSlug },
      'Updating file context',
    );
    await this.showcasesService.updateFileContext(id, fileId, dto.contextSlug);
  }

  @Put(':id/cover/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setCover(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    this.logger.info({ id, fileId }, 'Setting showcase cover image');
    // Wrapper: Setting cover is just updating context to 'cover'
    await this.showcasesService.updateFileContext(id, fileId, 'cover');
  }
}
