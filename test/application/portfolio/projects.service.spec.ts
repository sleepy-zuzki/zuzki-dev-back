import { ProjectsService } from '@application/portfolio/services/projects.service';
import { ProjectsRepositoryPort } from '@application/portfolio/ports/projects-repository.port';
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
} from '@domain/portfolio/types/project.types';

describe('ProjectsService (application · portfolio)', () => {
  let repo: jest.Mocked<ProjectsRepositoryPort>;
  let service: ProjectsService;

  const baseProject: Project = {
    id: 1,
    name: 'P1',
    slug: 'p1',
    description: null,
    repoUrl: null,
    liveUrl: null,
    category: null,
    year: null,
    isFeatured: false,
    technologies: [],
    previewImage: null,
  };

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      setTechnologies: jest.fn(),
      setPreviewImage: jest.fn(),
    };
    service = new ProjectsService(repo);
  });

  it('create: no toca relaciones cuando no vienen definidas', async () => {
    const input: CreateProjectInput = {
      name: 'P1',
      slug: 'p1',
    };
    repo.create.mockResolvedValue(baseProject);

    const created = await service.create(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.create).toHaveBeenCalledWith({ name: 'P1', slug: 'p1' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setTechnologies).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setPreviewImage).not.toHaveBeenCalled();
    expect(created).toEqual(baseProject);
  });

  it('create: setea relaciones cuando vienen definidas (array y number)', async () => {
    const input: CreateProjectInput = {
      name: 'P1',
      slug: 'p1',
      technologyIds: [2, 3],
      previewImageId: 10,
    };
    repo.create.mockResolvedValue(baseProject);

    const created = await service.create(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.create).toHaveBeenCalledWith({ name: 'P1', slug: 'p1' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setTechnologies).toHaveBeenCalledWith(1, [2, 3]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setPreviewImage).toHaveBeenCalledWith(1, 10);
    expect(created).toEqual(baseProject);
  });

  it('create: limpia relaciones cuando vienen null', async () => {
    const input: CreateProjectInput = {
      name: 'P1',
      slug: 'p1',
      technologyIds: null,
      previewImageId: null,
    };
    repo.create.mockResolvedValue(baseProject);

    const created = await service.create(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.create).toHaveBeenCalledWith({ name: 'P1', slug: 'p1' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setTechnologies).toHaveBeenCalledWith(1, []);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setPreviewImage).toHaveBeenCalledWith(1, null);
    expect(created).toEqual(baseProject);
  });

  it('update: no toca relaciones cuando no vienen definidas', async () => {
    const input: UpdateProjectInput = {
      name: 'nuevo',
    };
    repo.update.mockResolvedValue({ ...baseProject, name: 'nuevo' });

    const updated = await service.update(1, input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.update).toHaveBeenCalledWith(1, { name: 'nuevo' });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setTechnologies).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setPreviewImage).not.toHaveBeenCalled();
    expect(updated).toEqual({ ...baseProject, name: 'nuevo' });
  });

  it('update: setea relaciones cuando vienen definidas', async () => {
    const input: UpdateProjectInput = {
      technologyIds: [7],
      previewImageId: 22,
    };
    repo.update.mockResolvedValue(baseProject);

    const updated = await service.update(1, input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.update).toHaveBeenCalledWith(1, {});
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setTechnologies).toHaveBeenCalledWith(1, [7]);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setPreviewImage).toHaveBeenCalledWith(1, 22);
    expect(updated).toEqual(baseProject);
  });

  it('update: retorna null y no setea relaciones si no se encuentra', async () => {
    const input: UpdateProjectInput = {
      technologyIds: [1, 2],
      previewImageId: null,
    };
    repo.update.mockResolvedValue(null);

    const updated = await service.update(1, input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.update).toHaveBeenCalledWith(1, {});
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setTechnologies).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.setPreviewImage).not.toHaveBeenCalled();
    expect(updated).toBeNull();
  });
});
