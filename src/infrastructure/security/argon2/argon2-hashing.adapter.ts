import * as argon2 from 'argon2';
import { HashingPort } from '../../../application/security/ports/hashing.port';

export class Argon2HashingAdapter implements HashingPort {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }
}
