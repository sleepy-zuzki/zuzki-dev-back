import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StackEntity } from '@infra/database/typeorm/entities/catalog/stack.entity';
import {
  Stack,
  CreateStackInput,
  UpdateStackInput,
} from '@domain/catalog/types/stack.types';
import { StackRepositoryPort } from '@application/catalog/ports/stack-repository.port';

export class StacksRepositoryTypeormAdapter implements StackRepositoryPort {
  constructor(
    @InjectRepository(StackEntity)
    private readonly repo: Repository<StackEntity>,
  ) {}

  findAll(): Promise<Stack[]> {
    return this.repo
      .find({ order: { name: 'ASC' } })
      .then((list) => list.map(this.toDomain));
  }

  async findBySlug(slug: string): Promise<Stack | null> {
    const found = await this.repo.findOne({ where: { slug } });
    return found ? this.toDomain(found) : null;
  }

  async create(input: CreateStackInput): Promise<Stack> {
    const entity = this.repo.create(input);
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, input: UpdateStackInput): Promise<Stack | null> {
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

  private toDomain = (e: StackEntity): Stack => {
    const withDesc = e as unknown as { description?: string | null };
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: withDesc.description ?? null,
    };
  };
}
