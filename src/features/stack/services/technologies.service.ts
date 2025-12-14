import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';
import { StackTechnologyEntity } from '../entities/technology.entity';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(StackTechnologyEntity)
    private readonly repo: Repository<StackTechnologyEntity>,
  ) {}

  findAll(): Promise<StackTechnologyEntity[]> {
    return this.repo.find({
      order: { name: 'ASC' },
      relations: ['area'],
    });
  }

  findBySlug(slug: string): Promise<StackTechnologyEntity | null> {
    return this.repo.findOne({ where: { slug }, relations: ['area'] });
  }

  create(input: CreateTechnologyDto): Promise<StackTechnologyEntity> {
    const entity = this.repo.create(input);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    input: UpdateTechnologyDto,
  ): Promise<StackTechnologyEntity | null> {
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
