import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { BlogEntryEntity } from '../entities/blog-entry.entity';
import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;
  let repository: Repository<BlogEntryEntity>;

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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(BlogEntryEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    repository = module.get<Repository<BlogEntryEntity>>(
      getRepositoryToken(BlogEntryEntity),
    );
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
      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue({ id: 'new-id', ...dto });

      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(repository.findOneBy).toHaveBeenCalledWith({ slug: dto.slug });
      expect(repository.save).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException if slug exists', async () => {
      const dto = { title: 'New Blog', slug: 'existing-slug' };
      mockRepository.findOneBy.mockResolvedValue({ id: 'existing-id' });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of blog entries', async () => {
      mockRepository.find.mockResolvedValue([mockBlogEntry]);
      const result = await service.findAll();
      expect(result).toEqual([mockBlogEntry]);
      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
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

  describe('findBySlug', () => {
    it('should return a blog entry by slug', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlogEntry);
      const result = await service.findBySlug('test-blog');
      expect(result).toEqual(mockBlogEntry);
    });

    it('should throw NotFoundException if entry not found by slug', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a blog entry', async () => {
      const updateDto = { title: 'Updated Title' };
      mockRepository.findOne.mockResolvedValue(mockBlogEntry);
      mockRepository.save.mockResolvedValue({ ...mockBlogEntry, ...updateDto });

      const result = await service.update('uuid', updateDto);

      expect(result.title).toEqual('Updated Title');
      expect(repository.merge).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft remove a blog entry', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlogEntry);
      await service.remove('uuid');
      expect(repository.softRemove).toHaveBeenCalledWith(mockBlogEntry);
    });
  });
});
