import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { StackTechnologyEntity } from '@features/stack/entities/technology.entity';

import { CreateShowcaseDto } from '../dto/create-showcase.dto';
import { UpdateShowcaseDto } from '../dto/update-showcase.dto';
import { ShowcaseEntity } from '../entities/showcase.entity';

@Injectable()
export class ShowcasesService {
  constructor(
    @InjectRepository(ShowcaseEntity)
    private readonly repo: Repository<ShowcaseEntity>,
    @InjectRepository(StackTechnologyEntity)
    private readonly techRepo: Repository<StackTechnologyEntity>,
  ) {}

  findAll(): Promise<ShowcaseEntity[]> {
    return this.repo.find({
      order: { year: 'DESC', title: 'ASC' },
      relations: ['technologies'],
    });
  }

  findBySlug(slug: string): Promise<ShowcaseEntity | null> {
    return this.repo.findOne({ where: { slug }, relations: ['technologies'] });
  }

  async create(input: CreateShowcaseDto): Promise<ShowcaseEntity> {
    const { technologyIds, ...data } = input;

    const entity = this.repo.create(data);

    if (technologyIds?.length) {
      const techs = await this.techRepo.findBy({ id: In(technologyIds) });
      entity.technologies = techs;
    }

    return this.repo.save(entity);
  }

  async update(
    id: string,
    input: UpdateShowcaseDto,
  ): Promise<ShowcaseEntity | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: ['technologies'],
    });
    if (!found) return null;

    const { technologyIds, ...data } = input;

    this.repo.merge(found, data);

    if (technologyIds) {
      const techs = await this.techRepo.findBy({ id: In(technologyIds) });
      found.technologies = techs;
    }

    return this.repo.save(found);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
