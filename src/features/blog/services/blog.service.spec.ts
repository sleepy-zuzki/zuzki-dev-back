import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';
import { N8nService } from '@shared/n8n/n8n.service';

import { BlogEntryEntity } from '../entities/blog-entry.entity';
import { BlogFileEntity } from '../entities/blog-file.entity';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  const mockBlogEntry = {
    id: 'uuid',
    title: 'Test Blog',
    slug: 'test-blog',
    description: 'Test Description',
  } as BlogEntryEntity;

  const mockRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    softRemove: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockBlogFileRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCatalogItemRepository = {
    findOneBy: jest.fn(),
  };

  const mockN8nService = {
    sendWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(BlogEntryEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(BlogFileEntity),
          useValue: mockBlogFileRepository,
        },
        {
          provide: getRepositoryToken(CatalogItemEntity),
          useValue: mockCatalogItemRepository,
        },
        {
          provide: N8nService,
          useValue: mockN8nService,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new blog entry', async () => {
      const dto = { title: 'New Blog', slug: 'new-blog' };
      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockImplementation((d: any) => d);
      mockRepository.save.mockImplementation((d: any) =>
        Promise.resolve({ id: 'new-id', ...d }),
      );

      const result = await service.create(dto as any);

      expect(result).toHaveProperty('id');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ slug: dto.slug });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if slug exists', async () => {
      const dto = { title: 'New Blog', slug: 'existing-slug' };
      mockRepository.findOneBy.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of blog entries', async () => {
      mockRepository.find.mockResolvedValue([mockBlogEntry]);
      const result = await service.findAll();
      expect(result).toEqual([mockBlogEntry]);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { createdAt: 'DESC' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a blog entry by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlogEntry);
      const result = await service.findOne('uuid');
      expect(result).toEqual(mockBlogEntry);
    });

    it('should throw NotFoundException if entry not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a blog entry', async () => {
      const updateDto = { title: 'Updated Title' };
      mockRepository.findOne.mockResolvedValue(mockBlogEntry);
      mockRepository.save.mockResolvedValue({ ...mockBlogEntry, ...updateDto });

      const result = await service.update('uuid', updateDto as any);

      expect(result.title).toEqual('Updated Title');
      expect(mockRepository.merge).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft remove a blog entry', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlogEntry);
      await service.remove('uuid');
      expect(mockRepository.softRemove).toHaveBeenCalledWith(mockBlogEntry);
    });
  });
});
