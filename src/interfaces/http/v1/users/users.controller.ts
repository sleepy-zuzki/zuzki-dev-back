import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../../../../application/users/services/users.service';
import { toUserView } from '../../../../application/users/mappers/user.mappers';
import { CreateUserInput } from '../../../../domain/users/types/user.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { HASHING_SERVICE } from '../../../../application/security/ports/security.tokens';
import { HashingPort } from '../../../../application/security/ports/hashing.port';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(HASHING_SERVICE) private readonly hashing: HashingPort,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return toUserView(user);
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const passwordHash = await this.hashing.hash(dto.password);
    const input: CreateUserInput = {
      email: dto.email,
      passwordHash,
      roles: dto.roles,
      isActive: dto.isActive,
    };
    const created = await this.usersService.create(input);
    return toUserView(created);
  }
}
