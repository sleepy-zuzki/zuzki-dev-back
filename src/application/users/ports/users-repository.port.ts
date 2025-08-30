import type {
  User,
  UserId,
  CreateUserInput,
} from '@domain/users/types/user.types';

export interface UsersRepositoryPort {
  findByEmail(email: string): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
}
