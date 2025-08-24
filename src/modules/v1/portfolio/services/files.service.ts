import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../../../../core/database/entities';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly repo: Repository<FileEntity>,
  ) {}

  findAll(): Promise<FileEntity[]> {
    return this.repo.find({
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<FileEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['project'],
    });
  }
}
