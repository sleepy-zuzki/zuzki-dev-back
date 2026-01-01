import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { Argon2HashingAdapter } from '@shared/security/argon2-hashing.adapter';

import { UsersService } from '../../users/services/users.service';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { AuthConfigService } from '../services/auth-config.service';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../types/auth.types';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly users: UsersService,
    private readonly auth: AuthService,
    private readonly authConfig: AuthConfigService,
    private readonly hashing: Argon2HashingAdapter,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const ok = await this.hashing.verify(user.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.isActive) {
      // Mapeamos a una excepción HTTP explícita
      throw new UnauthorizedException('Usuario inactivo');
    }

    const accessToken = await this.auth.signAccessToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
    const expiresIn = this.authConfig.getAccessTokenTtl();

    const { refreshToken, expiresAt } = await this.auth.generateRefreshToken(
      user.id,
    );

    return {
      accessToken,
      expiresIn,
      refreshToken,
      refreshExpiresAt: expiresAt.toISOString(),
      user: { id: user.id, email: user.email, roles: user.roles },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: RefreshDto): Promise<LoginResponse> {
    if (!dto.userId || !dto.refreshToken) {
      throw new BadRequestException('Faltan parámetros');
    }
    // Verifica y rota el refresh token
    const rotated = await this.auth.rotateRefreshToken(
      dto.userId,
      dto.refreshToken,
    );

    const user = await this.users.findById(dto.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    const accessToken = await this.auth.signAccessToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
    const expiresIn = this.authConfig.getAccessTokenTtl();

    return {
      accessToken,
      expiresIn,
      refreshToken: rotated.refreshToken,
      refreshExpiresAt: rotated.expiresAt.toISOString(),
      user: { id: user.id, email: user.email, roles: user.roles },
    };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() dto: RefreshDto): Promise<{ success: boolean }> {
    if (!dto.userId || !dto.refreshToken) {
      throw new BadRequestException('Faltan parámetros');
    }
    // Validamos que el token pertenezca al usuario y esté activo para poder revocarlo
    const found = await this.auth.verifyRefreshToken(
      dto.userId,
      dto.refreshToken,
    );
    if (!found) {
      // Por seguridad, no revelamos si existe o no; considerarlo ya inválido
      throw new UnauthorizedException('Token inválido');
    }
    await this.auth.revokeRefreshToken(found.id);
    return { success: true };
  }
}
