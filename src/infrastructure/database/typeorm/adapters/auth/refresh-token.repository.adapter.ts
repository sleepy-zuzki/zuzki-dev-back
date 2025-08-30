import * as crypto from 'crypto';

import { IsNull } from 'typeorm';

import type { RefreshTokenPort } from '@application/auth/ports/refresh-token.port';
import { type HashingPort } from '@application/security/ports/hashing.port';
import type { ConfigurationService } from '@config/configuration.service';
import type { RefreshTokenEntity } from '@infra/database/typeorm/entities/auth/refresh-token.entity';

import type { Repository } from 'typeorm';

export class RefreshTokenTypeormAdapter implements RefreshTokenPort {
  constructor(
    private readonly repo: Repository<RefreshTokenEntity>,
    private readonly hashing: HashingPort,
    private readonly config: ConfigurationService,
  ) {}

  private ttlSeconds(): number {
    return this.config.getNumber('REFRESH_TOKEN_TTL', 60 * 60 * 24 * 7); // 7 días por defecto
  }

  private computeExpiresAt(now = new Date()): Date {
    const ttlMs = this.ttlSeconds() * 1000;
    return new Date(now.getTime() + ttlMs);
  }

  private generatePlainToken(): string {
    // Token aleatorio URL-safe simple; en proyectos reales preferir crypto.randomBytes(32).toString('hex') o similar
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async generate(
    userId: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    const refreshToken = this.generatePlainToken();
    const tokenHash = await this.hashing.hash(refreshToken);
    const expiresAt = this.computeExpiresAt();

    const entity = this.repo.create({
      userId,
      tokenHash,
      expiresAt,
      revokedAt: null,
    });

    await this.repo.save(entity);
    return { refreshToken, expiresAt };
  }

  async verify(userId: string, token: string): Promise<{ id: string } | null> {
    const candidates = await this.repo.find({
      where: { userId, revokedAt: IsNull() },
    });

    for (const candidate of candidates) {
      if (candidate.expiresAt <= new Date()) {
        continue;
      }
      const ok = await this.hashing.verify(candidate.tokenHash, token);
      if (ok) {
        return { id: candidate.id };
      }
    }
    return null;
  }

  async rotate(
    userId: string,
    currentToken: string,
  ): Promise<{ refreshToken: string; expiresAt: Date }> {
    const found = await this.verify(userId, currentToken);
    if (!found) {
      throw new Error('Refresh token inválido');
    }
    await this.revoke(found.id);
    return this.generate(userId);
  }

  async revoke(id: string): Promise<void> {
    await this.repo.update({ id }, { revokedAt: new Date() });
  }
}
