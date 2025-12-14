import { getAccessTokenTtl } from '@shared/config/token-ttl.util';

export class AuthConfigService {
  getAccessTokenTtl(): number {
    return getAccessTokenTtl();
  }
}
