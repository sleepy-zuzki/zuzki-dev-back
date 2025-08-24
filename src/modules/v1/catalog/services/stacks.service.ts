import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StackEntity } from '../../../../core/database/entities';

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
}
