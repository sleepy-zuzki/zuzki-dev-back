import type {
  Stack,
  CreateStackInput,
  UpdateStackInput,
} from '@domain/catalog/types/stack.types';

import type { StackRepositoryPort } from '../ports/stack-repository.port';

export class StacksService {
  constructor(private readonly repo: StackRepositoryPort) {}

  findAll(): Promise<Stack[]> {
    return this.repo.findAll();
  }

  findBySlug(slug: string): Promise<Stack | null> {
    return this.repo.findBySlug(slug);
  }

  create(input: CreateStackInput): Promise<Stack> {
    return this.repo.create(input);
  }

  update(id: number, input: UpdateStackInput): Promise<Stack | null> {
    return this.repo.update(id, input);
  }

  remove(id: number): Promise<boolean> {
    return this.repo.remove(id);
  }
}
