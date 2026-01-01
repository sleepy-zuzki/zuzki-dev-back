import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { Public } from '@features/auth/decorators/public.decorator';
import {
  AttachFileDto,
  ReorderFilesDto,
  UpdateFileContextDto,
} from '@shared/dto/manage-files.dto';

import { BlogFilterDto } from '../dto/blog-filter.dto';
import { BlogResponseDto } from '../dto/blog-response.dto';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogStatus } from '../enums/blog-status.enum';
import { toBlogResponse } from '../mappers/blog.mappers';
import { BlogService } from '../services/blog.service';

@Controller({ path: 'blog/entries', version: '1' })
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(BlogController.name);
  }

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogResponseDto> {
    this.logger.info({ slug: createBlogDto.slug }, 'Creating blog entry');
    const entry = await this.blogService.create(createBlogDto);
    return toBlogResponse(entry);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string): Promise<void> {
    this.logger.info({ id }, 'Publishing blog entry');
    return this.blogService.publish(id);
  }

  @Public()
  @Get()
  async findAll(@Query() filter: BlogFilterDto): Promise<BlogResponseDto[]> {
    this.logger.debug({ filter }, 'Listing blog entries');
    const entries = await this.blogService.findAll(filter.status);
    return entries.map(toBlogResponse);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogResponseDto> {
    const entry = await this.blogService.findOne(id);
    return toBlogResponse(entry);
  }

  @Public()
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<BlogResponseDto> {
    const entry = await this.blogService.findBySlug(slug);
    return toBlogResponse(entry);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogResponseDto> {
    this.logger.info({ id }, 'Updating blog entry');
    const entry = await this.blogService.update(id, updateBlogDto);
    return toBlogResponse(entry);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    this.logger.info({ id }, 'Deleting blog entry');
    await this.blogService.remove(id);
    return { success: true };
  }

  // --- FILE MANAGEMENT ENDPOINTS ---

  @Post(':id/files')
  @HttpCode(HttpStatus.NO_CONTENT)
  async attachFile(
    @Param('id') id: string,
    @Body() dto: AttachFileDto,
  ): Promise<void> {
    this.logger.info(
      { id, fileId: dto.fileId },
      'Attaching file to blog entry',
    );
    await this.blogService.attachFile(id, dto);
  }

  @Delete(':id/files/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async detachFile(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    this.logger.info({ id, fileId }, 'Detaching file from blog entry');
    await this.blogService.detachFile(id, fileId);
  }

  @Patch(':id/files/order')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reorderFiles(
    @Param('id') id: string,
    @Body() dto: ReorderFilesDto,
  ): Promise<void> {
    this.logger.info({ id }, 'Reordering files in blog entry');
    await this.blogService.reorderFiles(id, dto);
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
      'Updating blog file context',
    );
    await this.blogService.updateFileContext(id, fileId, dto.contextSlug);
  }

  @Put(':id/cover/:fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setCover(
    @Param('id') id: string,
    @Param('fileId') fileId: string,
  ): Promise<void> {
    this.logger.info({ id, fileId }, 'Setting blog entry cover image');
    await this.blogService.updateFileContext(id, fileId, 'cover');
  }
}
