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

import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogEntryEntity } from '../entities/blog-entry.entity';
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
  create(@Body() createBlogDto: CreateBlogDto): Promise<BlogEntryEntity> {
    this.logger.info({ slug: createBlogDto.slug }, 'Creating blog entry');
    return this.blogService.create(createBlogDto);
  }

  @Post(':id/publish')
  async publish(@Param('id') id: string): Promise<void> {
    this.logger.info({ id }, 'Publishing blog entry');
    return this.blogService.publish(id);
  }

  @Get()
  findAll(): Promise<BlogEntryEntity[]> {
    this.logger.debug('Listing all blog entries');
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogEntryEntity> {
    return this.blogService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<BlogEntryEntity> {
    return this.blogService.findBySlug(slug);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogEntryEntity> {
    this.logger.info({ id }, 'Updating blog entry');
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    this.logger.info({ id }, 'Deleting blog entry');
    await this.blogService.remove(id);
    return { success: true };
  }
}
