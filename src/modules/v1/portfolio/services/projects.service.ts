import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../../../../core/database/entities';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,
  ) {}

  findAll(): Promise<ProjectEntity[]> {
    return this.repo.find({
      relations: ['technologies', 'previewImage'],
      order: { isFeatured: 'DESC', year: 'DESC', name: 'ASC' },
    });
  }

  findBySlug(slug: string): Promise<ProjectEntity | null> {
    return this.repo.findOne({
      where: { slug },
      relations: ['technologies', 'previewImage'],
    });
  }
}
