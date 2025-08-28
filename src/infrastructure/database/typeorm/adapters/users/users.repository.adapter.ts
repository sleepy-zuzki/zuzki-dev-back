import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersRepositoryPort } from '@application/users/ports/users-repository.port';
import { User, CreateUserInput } from '@domain/users/types/user.types';
import { UserEntity } from '../../entities/user/user.entity';

export class UsersRepositoryTypeormAdapter implements UsersRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string) {
    const entity = await this.repo.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findById(id: string) {
    const entity = await this.repo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const entity = this.repo.create({
      email: input.email,
      passwordHash: input.passwordHash,
      roles: input.roles ?? ['user'],
      isActive: input.isActive ?? true,
    });
    const saved = await this.repo.save(entity);
    return this.toDomain(saved);
  }

  private toDomain(e: UserEntity): User {
    return {
      id: e.id,
      email: e.email,
      roles: e.roles,
      isActive: e.isActive,
      passwordHash: e.passwordHash,
    };
  }
}
