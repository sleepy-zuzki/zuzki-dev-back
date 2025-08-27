import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@application/users/services/users.service';
import { PasswordService } from '@app/auth/password.service';
import { AuthService } from '@app/auth/auth.service';
import { ConfigurationService } from '@config/configuration.service';
import { LoginDto } from '@app/auth/dto/login.dto';
import { RefreshDto } from '@app/auth/dto/refresh.dto';
import { LoginResponse } from '@app/auth/types/auth.types';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly users: UsersService,
    private readonly passwords: PasswordService,
    private readonly auth: AuthService,
    private readonly config: ConfigurationService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<LoginResponse> {
    const user = await this.users.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const ok = await this.passwords.verify(user.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    this.users.validateActive(user);

    const accessToken = await this.auth.signAccessToken({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
    const expiresIn = this.config.getNumber('ACCESS_TOKEN_TTL', 900);

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
    const expiresIn = this.config.getNumber('ACCESS_TOKEN_TTL', 900);

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
