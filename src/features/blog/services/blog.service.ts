import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';
import { AttachFileDto, ReorderFilesDto } from '@shared/dto/manage-files.dto';
import { N8nService } from '@shared/n8n/n8n.service';

import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogEntryEntity } from '../entities/blog-entry.entity';
import { BlogFileEntity } from '../entities/blog-file.entity';
import { BlogStatus } from '../enums/blog-status.enum';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private readonly blogRepository: Repository<BlogEntryEntity>,
    @InjectRepository(BlogFileEntity)
    private readonly blogFileRepository: Repository<BlogFileEntity>,
    @InjectRepository(CatalogItemEntity)
    private readonly catalogItemRepository: Repository<CatalogItemEntity>,
    private readonly n8nService: N8nService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<BlogEntryEntity> {
    const existing = await this.blogRepository.findOneBy({
      slug: createBlogDto.slug,
    });
    if (existing) {
      throw new BadRequestException('Slug already exists');
    }

    const entry = this.blogRepository.create({
      ...createBlogDto,
      status: BlogStatus.DRAFT,
    });
    return this.blogRepository.save(entry);
  }

  async publish(id: string): Promise<void> {
    const entry = await this.findOne(id);

    if (entry.status === BlogStatus.PUBLISHED) {
      return;
    }

    if (entry.status === BlogStatus.ARCHIVED) {
      throw new UnauthorizedException('Cannot publish an archived entry');
    }

    entry.status = BlogStatus.PUBLISHED;
    await this.blogRepository.save(entry);

    try {
      const postData = {
        postUrl: `https://zuzki.dev/blog/${entry.slug}`,
        tweetBody: 'Some Body', // TODO: Customize this body
      };
      
      await this.n8nService.sendWebhook('TWITTER_WEBHOOK_POST_BLOG', postData);
    } catch (error) {
      new Logger(BlogService.name).error(
        `Failed to send N8N webhook for blog ${entry.slug}`,
        error.stack,
      );
    }
  }

  findAll(status?: BlogStatus): Promise<BlogEntryEntity[]> {
    return this.blogRepository.find({
      where: status ? { status } : undefined,
      order: { createdAt: 'DESC' },
      relations: ['files', 'files.file', 'files.fileType'],
    });
  }

  async findOne(id: string): Promise<BlogEntryEntity> {
    const entry = await this.blogRepository.findOne({
      where: { id },
      relations: ['files', 'files.file', 'files.fileType'],
      order: {
        files: {
          order: 'ASC',
        },
      },
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
      order: {
        files: {
          order: 'ASC',
        },
      },
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

  // --- FILE MANAGEMENT ---

  async attachFile(blogId: string, dto: AttachFileDto): Promise<void> {
    const blog = await this.findOne(blogId);
    const fileType = await this.getFileTypeBySlug(dto.contextSlug);

    // If context is 'cover', remove previous cover
    if (dto.contextSlug === 'cover') {
      await this.removePreviousCover(blogId, fileType.id);
    }

    const blogFile = this.blogFileRepository.create({
      blogId: blog.id,
      fileId: dto.fileId,
      fileTypeId: fileType.id,
      order: dto.order ?? 1,
    });

    await this.blogFileRepository.save(blogFile);
  }

  async detachFile(blogId: string, fileId: string): Promise<void> {
    const result = await this.blogFileRepository.delete({ blogId, fileId });
    if (result.affected === 0) {
      throw new NotFoundException('File association not found');
    }
  }

  async reorderFiles(blogId: string, dto: ReorderFilesDto): Promise<void> {
    const { items } = dto;
    // Validate all items belong to the blog
    const count = await this.blogFileRepository.count({
      where: {
        blogId,
        fileId: In(items.map((i) => i.fileId)),
      },
    });

    if (count !== items.length) {
      throw new BadRequestException(
        'Some files do not belong to this blog entry',
      );
    }

    // Update in transaction or parallel
    await Promise.all(
      items.map((item) =>
        this.blogFileRepository.update(
          { blogId, fileId: item.fileId },
          { order: item.order },
        ),
      ),
    );
  }

  async updateFileContext(
    blogId: string,
    fileId: string,
    contextSlug: string,
  ): Promise<void> {
    const fileType = await this.getFileTypeBySlug(contextSlug);

    const association = await this.blogFileRepository.findOneBy({
      blogId,
      fileId,
    });

    if (!association) {
      throw new NotFoundException('File association not found');
    }

    if (contextSlug === 'cover') {
      await this.removePreviousCover(blogId, fileType.id);
    }

    association.fileTypeId = fileType.id;
    await this.blogFileRepository.save(association);
  }

  private async getFileTypeBySlug(slug: string): Promise<CatalogItemEntity> {
    const item = await this.catalogItemRepository.findOneBy({ slug });
    if (!item) {
      throw new BadRequestException(`Invalid file context: ${slug}`);
    }
    return item;
  }

  private async removePreviousCover(
    blogId: string,
    coverTypeId: string,
  ): Promise<void> {
    const galleryType = await this.catalogItemRepository.findOneBy({
      slug: 'gallery',
    });

    if (!galleryType) {
      return;
    }

    await this.blogFileRepository.update(
      { blogId, fileTypeId: coverTypeId },
      { fileTypeId: galleryType.id },
    );
  }
}
