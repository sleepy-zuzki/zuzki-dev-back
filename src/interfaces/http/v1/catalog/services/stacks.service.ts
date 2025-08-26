import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StackEntity } from '@infra/database/typeorm/entities/catalog/stack.entity';
import { CreateStackDto } from '../dto/create-stack.dto';
import { UpdateStackDto } from '../dto/update-stack.dto';

@Injectable()
export class StacksService {
  constructor(
    @InjectRepository(StackEntity)
    private readonly repo: Repository<StackEntity>,
  ) {}

  findAll(): Promise<StackEntity[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findBySlug(slug: string): Promise<StackEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async create(dto: CreateStackDto): Promise<StackEntity> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(id: number, dto: UpdateStackDto): Promise<StackEntity | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;
    Object.assign(found, dto);
    return this.repo.save(found);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
