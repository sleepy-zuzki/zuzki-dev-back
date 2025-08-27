import { FilesService } from '@application/portfolio/services/files.service';
import { FilesRepositoryPort } from '@application/portfolio/ports/files-repository.port';
import {
  File as DomainFile,
  CreateFileInput,
  UpdateFileInput,
} from '@domain/portfolio/types/file.types';

describe('FilesService (application · portfolio)', () => {
  let repo: jest.Mocked<FilesRepositoryPort>;
  let service: FilesService;

  const file: DomainFile = {
    id: 1,
    url: 'https://cdn/x.png',
    provider: null,
    mimeType: 'image/png',
    sizeBytes: 123,
    projectId: null,
  };

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    service = new FilesService(repo);
  });

  it('findAll delega en el repositorio', async () => {
    repo.findAll.mockResolvedValue([file]);
    const res = await service.findAll();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findAll).toHaveBeenCalled();
    expect(res).toEqual([file]);
  });

  it('findOne delega en el repositorio', async () => {
    repo.findOne.mockResolvedValue(file);
    const res = await service.findOne(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(res).toEqual(file);
  });

  it('create delega en el repositorio', async () => {
    const input: CreateFileInput = { url: file.url };
    repo.create.mockResolvedValue(file);
    const res = await service.create(input);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.create).toHaveBeenCalledWith(input);
    expect(res).toEqual(file);
  });

  it('update delega en el repositorio', async () => {
    const input: UpdateFileInput = { mimeType: 'image/webp' };
    const updated = { ...file, mimeType: 'image/webp' };
    repo.update.mockResolvedValue(updated);
    const res = await service.update(1, input);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.update).toHaveBeenCalledWith(1, input);
    expect(res).toEqual(updated);
  });

  it('remove delega en el repositorio', async () => {
    repo.remove.mockResolvedValue(true);
    const ok = await service.remove(1);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.remove).toHaveBeenCalledWith(1);
    expect(ok).toBe(true);
  });
});
