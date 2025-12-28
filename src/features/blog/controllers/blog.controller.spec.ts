import { Test, type TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { BlogService } from '../services/blog.service';
import { BlogController } from './blog.controller';

describe('BlogController', () => {
  let controller: BlogController;
  let service: BlogService;

  const mockBlogEntry = {
    id: 'uuid',
    title: 'Test Blog',
    slug: 'test-blog',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  const mockBlogResponse = {
    id: 'uuid',
    title: 'Test Blog',
    slug: 'test-blog',
    status: 'draft',
    createdAt: (mockBlogEntry as { createdAt: Date }).createdAt,
    updatedAt: (mockBlogEntry as { updatedAt: Date }).updatedAt,
  };

  const mockBlogService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    publish: jest.fn(),
  };

  const mockLogger = {
    setContext: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        { provide: BlogService, useValue: mockBlogService },
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<BlogController>(BlogController);
    service = module.get<BlogService>(BlogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { title: 'New', slug: 'new' };
      mockBlogService.create.mockResolvedValue(mockBlogEntry);
      const result = await controller.create(dto as any);
      expect(result).toEqual(mockBlogResponse);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      mockBlogService.findAll.mockResolvedValue([mockBlogEntry]);
      const result = await controller.findAll();
      expect(result).toEqual([mockBlogResponse]);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      mockBlogService.findOne.mockResolvedValue(mockBlogEntry);
      const result = await controller.findOne('uuid');
      expect(result).toEqual(mockBlogResponse);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });
  });

  describe('findBySlug', () => {
    it('should call service.findBySlug', async () => {
      mockBlogService.findBySlug.mockResolvedValue(mockBlogEntry);
      const result = await controller.findBySlug('slug');
      expect(result).toEqual(mockBlogResponse);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.findBySlug).toHaveBeenCalledWith('slug');
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const dto = { title: 'Updated' };
      mockBlogService.update.mockResolvedValue(mockBlogEntry);
      const result = await controller.update('uuid', dto as any);
      expect(result).toEqual(mockBlogResponse);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.update).toHaveBeenCalledWith('uuid', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      mockBlogService.remove.mockResolvedValue(undefined);
      const result = await controller.remove('uuid');
      expect(result).toEqual({ success: true });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.remove).toHaveBeenCalledWith('uuid');
    });
  });
});
