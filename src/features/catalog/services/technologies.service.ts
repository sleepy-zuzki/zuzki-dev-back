import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Technology,
  CreateTechnologyInput,
  UpdateTechnologyInput,
} from '@features/catalog/dto/technology.types';
import { TechnologyEntity } from '@features/catalog/entities/technology.entity';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(TechnologyEntity)
    private readonly repo: Repository<TechnologyEntity>,
  ) { }

  findAll(): Promise<Technology[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findBySlug(slug: string): Promise<Technology | null> {
    return this.repo.findOne({ where: { slug } });
  }

  create(input: CreateTechnologyInput): Promise<Technology> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  async update(
    id: number,
    input: UpdateTechnologyInput,
  ): Promise<Technology | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    this.repo.merge(found, input);
    return this.repo.save(found);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
