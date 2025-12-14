import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user.response.dto';
import { toUserView } from '../mappers/user.mappers';
import { UsersService } from '../services/users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return toUserView(user);
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    const created = await this.usersService.createWithPassword({
      email: dto.email,
      password: dto.password,
      roles: dto.roles,
      isActive: dto.isActive,
    });
    return toUserView(created);
  }
}
