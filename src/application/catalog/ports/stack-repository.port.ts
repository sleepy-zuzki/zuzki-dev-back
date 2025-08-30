import type {
  Stack,
  CreateStackInput,
  UpdateStackInput,
} from '@domain/catalog/types/stack.types';

export interface StackRepositoryPort {
  findAll(): Promise<Stack[]>;
  findBySlug(slug: string): Promise<Stack | null>;
  create(input: CreateStackInput): Promise<Stack>;
  update(id: number, input: UpdateStackInput): Promise<Stack | null>;
  remove(id: number): Promise<boolean>;
}
