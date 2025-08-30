import type { UsersRepositoryPort } from '../ports/users-repository.port';
import type {
  User,
  UserId,
  CreateUserInput,
  CreateUserWithPasswordInput,
} from '@domain/users/types/user.types';
import type { HashingPort } from '@application/security/ports/hashing.port';

export class UsersService {
  constructor(
    private readonly repo: UsersRepositoryPort,
    private readonly hashing: HashingPort,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }

  findById(id: UserId): Promise<User | null> {
    return this.repo.findById(id);
  }

  async create(input: CreateUserInput): Promise<User> {
    const roles = input.roles ?? ['user'];
    const isActive = input.isActive ?? true;
    return this.repo.create({ ...input, roles, isActive });
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
      // Capa superior debería convertir a excepción HTTP si aplica
      throw new Error('El usuario está inactivo');
    }
  }
}
