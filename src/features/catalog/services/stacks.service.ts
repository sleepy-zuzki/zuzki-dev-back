import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Stack,
  CreateStackInput,
  UpdateStackInput,
} from '@features/catalog/dto/stack.types';
import { StackEntity } from '@features/catalog/entities/stack.entity';

@Injectable()
export class StacksService {
  constructor(
    @InjectRepository(StackEntity)
    private readonly repo: Repository<StackEntity>,
  ) {}

  findAll(): Promise<Stack[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findBySlug(slug: string): Promise<Stack | null> {
    return this.repo.findOne({ where: { slug } });
  }

  create(input: CreateStackInput): Promise<Stack> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  async update(id: number, input: UpdateStackInput): Promise<Stack | null> {
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
