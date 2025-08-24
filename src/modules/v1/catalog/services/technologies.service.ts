import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnologyEntity } from '../../../../core/database/entities';

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
}
