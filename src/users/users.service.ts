import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../core/database/entities';
import { CreateUserInput } from './types/user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const entity = this.repo.create({
      email: input.email,
      passwordHash: input.passwordHash,
      roles: input.roles ?? ['user'],
      isActive: input.isActive ?? true,
    });
    return this.repo.save(entity);
  }

  validateActive(user: Pick<UserEntity, 'isActive'>): void {
    if (!user.isActive) {
      throw new Error('El usuario está inactivo');
    }
  }
}
