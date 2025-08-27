import { UsersService } from '@application/users/services/users.service';
import { UsersRepositoryPort } from '@application/users/ports/users-repository.port';
import { CreateUserInput, User } from '@domain/users/types/user.types';

describe('UsersService (application)', () => {
  let repo: jest.Mocked<UsersRepositoryPort>;
  let service: UsersService;

  beforeEach(() => {
    repo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };
    service = new UsersService(repo);
  });

  it('create aplica defaults (roles=["user"], isActive=true) cuando no se proveen', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      passwordHash: 'hash',
    };
    const created: User = {
      id: 'u1',
      email: input.email,
      roles: ['user'],
      isActive: true,
      passwordHash: input.passwordHash,
    };
    repo.create.mockResolvedValue(created);

    const result = await service.create(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.create).toHaveBeenCalledWith({
      email: input.email,
      passwordHash: input.passwordHash,
      roles: ['user'],
      isActive: true,
    });
    expect(result).toEqual(created);
  });

  it('create respeta roles e isActive cuando se proveen', async () => {
    const input: CreateUserInput = {
      email: 'a@b.c',
      passwordHash: 'hash',
      roles: ['admin'],
      isActive: false,
    };
    const created: User = {
      id: 'u2',
      email: input.email,
      roles: input.roles!,
      isActive: input.isActive!,
      passwordHash: input.passwordHash,
    };
    repo.create.mockResolvedValue(created);

    const result = await service.create(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(created);
  });

  it('findByEmail delega en el repositorio', async () => {
    const user: User = {
      id: 'u3',
      email: 'x@y.z',
      roles: ['user'],
      isActive: true,
      passwordHash: 'h',
    };
    repo.findByEmail.mockResolvedValue(user);

    const result = await service.findByEmail('x@y.z');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findByEmail).toHaveBeenCalledWith('x@y.z');
    expect(result).toBe(user);
  });

  it('findById delega en el repositorio', async () => {
    const user: User = {
      id: 'u4',
      email: 'x@y.z',
      roles: ['user'],
      isActive: true,
      passwordHash: 'h',
    };
    repo.findById.mockResolvedValue(user);

    const result = await service.findById('u4');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.findById).toHaveBeenCalledWith('u4');
    expect(result).toBe(user);
  });

  it('validateActive lanza error si el usuario está inactivo', () => {
    expect(() => service.validateActive({ isActive: false })).toThrow(
      'El usuario está inactivo',
    );
  });

  it('validateActive no lanza si el usuario está activo', () => {
    expect(() => service.validateActive({ isActive: true })).not.toThrow();
  });
});
