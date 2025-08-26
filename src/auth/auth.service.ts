import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RefreshTokenEntity } from '../infrastructure/database/typeorm/entities/auth/refresh-token.entity';
import { ConfigurationService } from '../config/configuration.service';
import { AccessTokenPayload, RefreshTokenResult } from './types/token.types';
import { randomBytes } from 'node:crypto';
import argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigurationService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshRepo: Repository<RefreshTokenEntity>,
  ) {}

  // Firma un access token JWT para el usuario
  async signAccessToken(user: {
    id: string;
    email: string;
    roles: string[];
  }): Promise<string> {
    const secret = this.config.getString('APP_JWT_SECRET');
    const issuer = process.env.APP_JWT_ISSUER || undefined;
    const audience = process.env.APP_JWT_AUDIENCE || undefined;
    const ttl = this.config.getNumber('ACCESS_TOKEN_TTL', 900);

    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return this.jwt.signAsync(payload, {
      secret,
      issuer,
      audience,
      algorithm: 'HS256',
      expiresIn: ttl,
    });
  }

  // Genera y guarda un refresh token opaco (hash en BD); retorna el token en claro y expiración
  async generateRefreshToken(userId: string): Promise<RefreshTokenResult> {
    const ttl = this.config.getNumber('REFRESH_TOKEN_TTL', 60 * 60 * 24 * 30);
    const expiresAt = new Date(Date.now() + ttl * 1000);

    const refreshToken = this.createOpaqueToken();
    const tokenHash = await argon2.hash(refreshToken, {
      type: argon2.argon2id,
    });

    const entity = this.refreshRepo.create({
      userId,
      tokenHash,
      expiresAt,
      revokedAt: null,
    });
    await this.refreshRepo.save(entity);

    return { refreshToken, expiresAt };
  }

  // Verifica un refresh token válido (no expirado, no revocado) para el usuario
  async verifyRefreshToken(
    userId: string,
    token: string,
  ): Promise<RefreshTokenEntity | null> {
    const candidates = await this.refreshRepo.find({
      where: { userId, revokedAt: null, expiresAt: MoreThan(new Date()) },
      order: { createdAt: 'DESC' },
    });
    for (const c of candidates) {
      const ok = await argon2.verify(c.tokenHash, token);
      if (ok) return c;
    }
    return null;
  }

  // Revoca un refresh token por id
  async revokeRefreshToken(id: string): Promise<void> {
    await this.refreshRepo.update({ id }, { revokedAt: new Date() });
  }

  // Revoca todos los refresh tokens activos de un usuario
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshRepo.update(
      { userId, revokedAt: null, expiresAt: MoreThan(new Date()) },
      { revokedAt: new Date() },
    );
  }

  // Rotación: verifica token actual, lo revoca y emite uno nuevo
  async rotateRefreshToken(
    userId: string,
    token: string,
  ): Promise<RefreshTokenResult> {
    const found = await this.verifyRefreshToken(userId, token);
    if (!found) {
      throw new Error('Refresh token inválido o expirado');
    }
    await this.revokeRefreshToken(found.id);
    return this.generateRefreshToken(userId);
  }

  private createOpaqueToken(): string {
    // 64 bytes -> ~86 caracteres base64url; suficiente entropía
    return randomBytes(64).toString('base64url');
  }
}
