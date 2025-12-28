import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';

import { CatalogItemEntity } from '@features/catalog/entities/catalog-item.entity';
import { StackTechnologyEntity } from '@features/stack/entities/technology.entity';
import { AttachFileDto, ReorderFilesDto } from '@shared/dto/manage-files.dto';

import { CreateShowcaseDto } from '../dto/create-showcase.dto';
import { UpdateShowcaseDto } from '../dto/update-showcase.dto';
import { ShowcaseFileEntity } from '../entities/showcase-file.entity';
import { ShowcaseEntity } from '../entities/showcase.entity';

@Injectable()
export class ShowcasesService {
  constructor(
    @InjectRepository(ShowcaseEntity)
    private readonly repo: Repository<ShowcaseEntity>,
    @InjectRepository(StackTechnologyEntity)
    private readonly techRepo: Repository<StackTechnologyEntity>,
    @InjectRepository(ShowcaseFileEntity)
    private readonly fileRepo: Repository<ShowcaseFileEntity>,
    @InjectRepository(CatalogItemEntity)
    private readonly catalogRepo: Repository<CatalogItemEntity>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<ShowcaseEntity[]> {
    return this.repo.find({
      order: { year: 'DESC', title: 'ASC' },
      relations: [
        'technologies',
        'area',
        'files',
        'files.file',
        'files.fileType',
      ],
    });
  }

  findFeatured(): Promise<ShowcaseEntity[]> {
    return this.repo.find({
      where: { isFeatured: true },
      order: { year: 'DESC', title: 'ASC' },
      relations: [
        'technologies',
        'area',
        'files',
        'files.file',
        'files.fileType',
      ],
    });
  }

  findBySlug(slug: string): Promise<ShowcaseEntity | null> {
    return this.repo.findOne({
      where: { slug },
      relations: [
        'technologies',
        'area',
        'files',
        'files.file',
        'files.fileType',
      ],
    });
  }

  async create(input: CreateShowcaseDto): Promise<ShowcaseEntity> {
    const { technologyIds, ...data } = input;

    const entity = this.repo.create(data);

    if (technologyIds?.length) {
      const techs = await this.techRepo.findBy({ id: In(technologyIds) });
      entity.technologies = techs;
    }

    return this.repo.save(entity);
  }

  async update(
    id: string,
    input: UpdateShowcaseDto,
  ): Promise<ShowcaseEntity | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: [
        'technologies',
        'area',
        'files',
        'files.file',
        'files.fileType',
      ],
    });
    if (!found) return null;

    const { technologyIds, ...data } = input;

    this.repo.merge(found, data);

    if (technologyIds) {
      const techs = await this.techRepo.findBy({ id: In(technologyIds) });
      found.technologies = techs;
    }

    return this.repo.save(found);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  // --- FILE MANAGEMENT ---

  private async getCatalogIdBySlug(slug: string): Promise<string> {
    const item = await this.catalogRepo.findOne({ where: { slug } });
    if (!item) {
      throw new BadRequestException(
        `Catalog item with slug '${slug}' not found`,
      );
    }
    return item.id;
  }

  async attachFile(showcaseId: string, input: AttachFileDto): Promise<void> {
    const showcase = await this.repo.findOneBy({ id: showcaseId });
    if (!showcase) throw new NotFoundException('Showcase not found');

    const typeId = await this.getCatalogIdBySlug(input.contextSlug);

    // Si el contexto es 'cover', aseguramos unicidad
    if (input.contextSlug === 'cover') {
      await this.demoteExistingCover(showcaseId);
    }

    // Verificar si ya existe relación
    const existing = await this.fileRepo.findOne({
      where: { showcaseId, fileId: input.fileId },
    });

    if (existing) {
      existing.fileTypeId = typeId;
      if (input.order !== undefined) existing.order = input.order;
      await this.fileRepo.save(existing);
    } else {
      const newRelation = this.fileRepo.create({
        showcaseId,
        fileId: input.fileId,
        fileTypeId: typeId,
        order: input.order ?? 1,
      });
      await this.fileRepo.save(newRelation);
    }
  }

  async detachFile(showcaseId: string, fileId: string): Promise<void> {
    await this.fileRepo.delete({ showcaseId, fileId });
  }

  async reorderFiles(showcaseId: string, dto: ReorderFilesDto): Promise<void> {
    // Usamos transacción para asegurar consistencia
    await this.dataSource.transaction(async (manager) => {
      for (const item of dto.items) {
        await manager.update(
          ShowcaseFileEntity,
          { showcaseId, fileId: item.fileId },
          { order: item.order },
        );
      }
    });
  }

  async updateFileContext(
    showcaseId: string,
    fileId: string,
    contextSlug: string,
  ): Promise<void> {
    const typeId = await this.getCatalogIdBySlug(contextSlug);

    if (contextSlug === 'cover') {
      await this.demoteExistingCover(showcaseId);
    }

    const result = await this.fileRepo.update(
      { showcaseId, fileId },
      { fileTypeId: typeId },
    );

    if (result.affected === 0) {
      throw new NotFoundException('File association not found');
    }
  }

  /**
   * Busca si hay alguna imagen 'cover' en el proyecto y la cambia a 'gallery'.
   */
  private async demoteExistingCover(showcaseId: string): Promise<void> {
    const coverType = await this.catalogRepo.findOneBy({ slug: 'cover' });
    const galleryType = await this.catalogRepo.findOneBy({ slug: 'gallery' });

    if (!coverType || !galleryType) return; // Si no existen seeds, no hacemos nada (seguridad)

    // Buscar la portada actual
    const currentCover = await this.fileRepo.findOne({
      where: { showcaseId, fileTypeId: coverType.id },
    });

    if (currentCover) {
      currentCover.fileTypeId = galleryType.id;
      await this.fileRepo.save(currentCover);
    }
  }
}
