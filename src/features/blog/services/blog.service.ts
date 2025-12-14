import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogEntryEntity } from '../entities/blog-entry.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private readonly blogRepository: Repository<BlogEntryEntity>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogEntryEntity> {
    const existing = await this.blogRepository.findOneBy({
      slug: createBlogDto.slug,
    });
    if (existing) {
      throw new BadRequestException('Slug already exists');
    }

    const entry = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(entry);
  }

  findAll(): Promise<BlogEntryEntity[]> {
    return this.blogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<BlogEntryEntity> {
    const entry = await this.blogRepository.findOne({
      where: { id },
      relations: ['files', 'files.file', 'files.fileType'],
    });
    if (!entry) {
      throw new NotFoundException(`Blog entry with ID "${id}" not found`);
    }
    return entry;
  }

  async findBySlug(slug: string): Promise<BlogEntryEntity> {
    const entry = await this.blogRepository.findOne({
      where: { slug },
      relations: ['files', 'files.file', 'files.fileType'],
    });
    if (!entry) {
      throw new NotFoundException(`Blog entry with slug "${slug}" not found`);
    }
    return entry;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogEntryEntity> {
    const entry = await this.findOne(id);
    this.blogRepository.merge(entry, updateBlogDto);
    return this.blogRepository.save(entry);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.findOne(id);
    await this.blogRepository.softRemove(entry);
  }
}
