import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnologyEntity } from '../../../../core/database/entities';
import { CreateTechnologyDto } from '../dto/create-technology.dto';
import { UpdateTechnologyDto } from '../dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(TechnologyEntity)
    private readonly repo: Repository<TechnologyEntity>,
  ) {}

  findAll(): Promise<TechnologyEntity[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findBySlug(slug: string): Promise<TechnologyEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async create(dto: CreateTechnologyDto): Promise<TechnologyEntity> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async update(
    id: number,
    dto: UpdateTechnologyDto,
  ): Promise<TechnologyEntity | null> {
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
