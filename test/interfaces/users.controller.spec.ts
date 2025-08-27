import { NotFoundException } from '@nestjs/common';
import { UsersController } from '@interfaces/http/v1/users/users.controller';
import { UsersService } from '@application/users/services/users.service';
import { CreateUserDto } from '@interfaces/http/v1/users/dto/create-user.dto';
import { validate } from 'class-validator';
import { User } from '@domain/users/types/user.types';

describe('UsersController (interfaces HTTP)', () => {
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

  it('getById lanza NotFoundException cuando el usuario no existe', async () => {
    usersService.findById.mockResolvedValue(null);

    await expect(controller.getById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('create delega en service.createWithPassword y retorna UserResponseDto', async () => {
    const dto = new CreateUserDto();
    dto.email = 'john@example.com';
    dto.password = 'SuperSecret123';
    dto.roles = ['user'];
    dto.isActive = true;

    const domainUser: User = {
      id: 'id-123',
      email: dto.email,
      roles: dto.roles,
      isActive: dto.isActive,
      passwordHash: 'HASHED',
    };
    usersService.createWithPassword.mockResolvedValue(domainUser);

    const result = await controller.create(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(usersService.createWithPassword).toHaveBeenCalledWith({
      email: dto.email,
      password: dto.password,
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
