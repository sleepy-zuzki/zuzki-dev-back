import type {
  Technology,
  CreateTechnologyInput,
  UpdateTechnologyInput,
} from '@domain/catalog/types/technology.types';
import type { TechnologyRepositoryPort } from '../ports/technology-repository.port';

export class TechnologiesService {
  constructor(private readonly repo: TechnologyRepositoryPort) {}

  findAll(): Promise<Technology[]> {
    return this.repo.findAll();
  }

  findBySlug(slug: string): Promise<Technology | null> {
    return this.repo.findBySlug(slug);
  }

  create(input: CreateTechnologyInput): Promise<Technology> {
    return this.repo.create(input);
  }

  update(id: number, input: UpdateTechnologyInput): Promise<Technology | null> {
    return this.repo.update(id, input);
  }

  remove(id: number): Promise<boolean> {
    return this.repo.remove(id);
  }
}
