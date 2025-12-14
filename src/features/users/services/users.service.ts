import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Argon2HashingAdapter } from '@shared/security/argon2-hashing.adapter';

import { UserEntity } from '../entities/user.entity';

import type {
  User,
  UserId,
  CreateUserInput,
  CreateUserWithPasswordInput,
} from '../dto/user.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly hashing: Argon2HashingAdapter,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo
      .findOne({ where: { email } })
      .then((u) => this.toDomain(u));
  }

  findById(id: UserId): Promise<User | null> {
    return this.repo.findOne({ where: { id } }).then((u) => this.toDomain(u));
  }

  async create(input: CreateUserInput): Promise<User> {
    const roles = input.roles ?? ['user'];
    const isActive = input.isActive ?? true;
    const entity = this.repo.create({ ...input, roles, isActive });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  async createWithPassword(input: CreateUserWithPasswordInput): Promise<User> {
    const passwordHash = await this.hashing.hash(input.password);
    return this.create({
      email: input.email,
      passwordHash,
      roles: input.roles,
      isActive: input.isActive,
    });
  }

  validateActive(user: Pick<User, 'isActive'>): void {
    if (!user.isActive) {
      throw new Error('El usuario está inactivo');
    }
  }

  private toDomain(entity: UserEntity): User;
  private toDomain(entity: UserEntity | null): User | null;
  private toDomain(entity: UserEntity | null): User | null {
    if (!entity) return null;
    return {
      id: entity.id,
      email: entity.email,
      roles: entity.roles,
      isActive: entity.isActive,
      passwordHash: entity.passwordHash,
    };
  }
}
