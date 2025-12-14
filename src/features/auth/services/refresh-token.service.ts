import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { ConfigurationService } from '@config/configuration.service';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import { Argon2HashingAdapter } from '@shared/security/argon2-hashing.adapter';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repo: Repository<RefreshTokenEntity>,
    private readonly hashing: Argon2HashingAdapter,
    private readonly config: ConfigurationService,
  ) { }

  private ttlSeconds(): number {
    return this.config.getNumber('REFRESH_TOKEN_TTL', 60 * 60 * 24 * 7); // 7 días por defecto
  }

  private computeExpiresAt(now = new Date()): Date {
    const ttlMs = this.ttlSeconds() * 1000;
    return new Date(now.getTime() + ttlMs);
  }

  private generatePlainToken(): string {
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
