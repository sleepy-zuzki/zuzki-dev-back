import { NotFoundException } from '@nestjs/common';
import { UsersController } from '@interfaces/http/v1/users/users.controller';
import { UsersService } from '@application/users/services/users.service';
import { HashingPort } from '@application/security/ports/hashing.port';
import { CreateUserDto } from '@interfaces/http/v1/users/dto/create-user.dto';
import { validate } from 'class-validator';
import { User } from '@domain/users/types/user.types';

describe('UsersController (interfaces HTTP)', () => {
  let usersService: jest.Mocked<UsersService>;
  let hashing: jest.Mocked<HashingPort>;
  let controller: UsersController;

  beforeEach(() => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      validateActive: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    hashing = {
      hash: jest.fn(),
    };

    controller = new UsersController(usersService, hashing);
  });

  it('getById lanza NotFoundException cuando el usuario no existe', async () => {
    usersService.findById.mockResolvedValue(null);

    await expect(controller.getById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('create hashea la contraseña y retorna UserResponseDto', async () => {
    const dto = new CreateUserDto();
    dto.email = 'john@example.com';
    dto.password = 'SuperSecret123';
    dto.roles = ['user'];
    dto.isActive = true;

    hashing.hash.mockResolvedValue('HASHED');
    const domainUser: User = {
      id: 'id-123',
      email: dto.email,
      roles: dto.roles,
      isActive: dto.isActive,
      passwordHash: 'HASHED',
    };
    usersService.create.mockResolvedValue(domainUser);

    const result = await controller.create(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(hashing.hash).toHaveBeenCalledWith(dto.password);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(usersService.create).toHaveBeenCalledWith({
      email: dto.email,
      passwordHash: 'HASHED',
      roles: dto.roles,
      isActive: dto.isActive,
    });
    expect(result).toEqual({
      id: 'id-123',
      email: 'john@example.com',
      roles: ['user'],
      isActive: true,
    });
  });

  it('CreateUserDto valida email y longitud de password', async () => {
    const dto = new CreateUserDto();
    dto.email = 'not-an-email';
    dto.password = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const fieldsWithErrors = errors.map((e) => e.property);
    expect(fieldsWithErrors).toContain('email');
    expect(fieldsWithErrors).toContain('password');
  });
});
