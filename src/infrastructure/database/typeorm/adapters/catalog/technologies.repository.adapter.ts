import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TechnologyRepositoryPort } from '@application/catalog/ports/technology-repository.port';
import {
  Technology,
  CreateTechnologyInput,
  UpdateTechnologyInput,
} from '@domain/catalog/types/technology.types';
import { TechnologyEntity } from '@infra/database/typeorm/entities/catalog/technology.entity';

export class TechnologiesRepositoryTypeormAdapter
  implements TechnologyRepositoryPort
{
  constructor(
    @InjectRepository(TechnologyEntity)
    private readonly repo: Repository<TechnologyEntity>,
  ) {}

  findAll(): Promise<Technology[]> {
    return this.repo
      .find({ order: { name: 'ASC' } })
      .then((list) => list.map(this.toDomain));
  }

  async findBySlug(slug: string): Promise<Technology | null> {
    const found = await this.repo.findOne({ where: { slug } });
    return found ? this.toDomain(found) : null;
  }

  async create(input: CreateTechnologyInput): Promise<Technology> {
    const entity = this.repo.create(input);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(
    id: number,
    input: UpdateTechnologyInput,
  ): Promise<Technology | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    Object.assign(found, input);
    const saved = await this.repo.save(found);
    return this.toDomain(saved);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain = (e: TechnologyEntity): Technology => {
    const withDesc = e as unknown as { description?: string | null };
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: withDesc.description ?? null,
    };
  };
}
