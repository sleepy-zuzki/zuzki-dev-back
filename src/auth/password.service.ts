import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';

@Injectable()
export class PasswordService {
  async hash(plain: string): Promise<string> {
    if (!plain || plain.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    return argon2.hash(plain, { type: argon2.argon2id });
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    if (!hash || !plain) return false;
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }
}
