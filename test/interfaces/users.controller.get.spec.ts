import { UsersController } from '@interfaces/http/v1/users/users.controller';
import { UsersService } from '@application/users/services/users.service';
import { User } from '@domain/users/types/user.types';

describe('UsersController - getById (success path)', () => {
  let usersService: jest.Mocked<UsersService>;
  let controller: UsersController;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      createWithPassword: jest.fn(),
      validateActive: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    controller = new UsersController(usersService);
  });

  it('retorna UserResponseDto cuando el usuario existe', async () => {
    const domainUser: User = {
      id: 'u1',
      email: 'john@example.com',
      roles: ['user'],
      isActive: true,
      passwordHash: 'HASHED',
    };
    usersService.findById.mockResolvedValue(domainUser);

    const result = await controller.getById('u1');

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(usersService.findById).toHaveBeenCalledWith('u1');
    expect(result).toEqual({
      id: 'u1',
      email: 'john@example.com',
      roles: ['user'],
      isActive: true,
    });
  });
});
