import * as argon2 from 'argon2';

import type { HashingPort } from '../../../application/security/ports/hashing.port';

export class Argon2HashingAdapter implements HashingPort {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }

  async verify(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }
}
