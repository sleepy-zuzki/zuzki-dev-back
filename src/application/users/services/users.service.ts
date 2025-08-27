import { UsersRepositoryPort } from '../ports/users-repository.port';
import { User, UserId, CreateUserInput } from '@domain/users/types/user.types';

export class UsersService {
  constructor(private readonly repo: UsersRepositoryPort) {}

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

  validateActive(user: Pick<User, 'isActive'>): void {
    if (!user.isActive) {
      // Capa superior debería convertir a excepción HTTP si aplica
      throw new Error('El usuario está inactivo');
    }
  }
}
