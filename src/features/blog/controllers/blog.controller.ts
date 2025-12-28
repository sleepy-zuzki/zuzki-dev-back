import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { BlogResponseDto } from '../dto/blog-response.dto';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
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

  @Get()
  async findAll(): Promise<BlogResponseDto[]> {
    this.logger.debug('Listing all blog entries');
    const entries = await this.blogService.findAll();
    return entries.map(toBlogResponse);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogResponseDto> {
    const entry = await this.blogService.findOne(id);
    return toBlogResponse(entry);
  }

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
}
