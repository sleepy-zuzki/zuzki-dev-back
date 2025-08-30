import type {
  Technology,
  CreateTechnologyInput,
  UpdateTechnologyInput,
} from '@domain/catalog/types/technology.types';

export interface TechnologyRepositoryPort {
  findAll(): Promise<Technology[]>;
  findBySlug(slug: string): Promise<Technology | null>;
  create(input: CreateTechnologyInput): Promise<Technology>;
  update(id: number, input: UpdateTechnologyInput): Promise<Technology | null>;
  remove(id: number): Promise<boolean>;
}
