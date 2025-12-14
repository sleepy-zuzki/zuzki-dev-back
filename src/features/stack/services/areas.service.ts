import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';
import { StackAreaEntity } from '../entities/area.entity';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(StackAreaEntity)
    private readonly repo: Repository<StackAreaEntity>,
  ) {}

  findAll(): Promise<StackAreaEntity[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findBySlug(slug: string): Promise<StackAreaEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }

  create(input: CreateAreaDto): Promise<StackAreaEntity> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    input: UpdateAreaDto,
  ): Promise<StackAreaEntity | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    this.repo.merge(found, input);
    return this.repo.save(found);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
